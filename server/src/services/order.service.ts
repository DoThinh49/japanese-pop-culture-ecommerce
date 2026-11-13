import prisma from "../config/prisma.js";
import { OrderStatus, PaymentMethod, PaymentStatus, OrderType, Role } from "@prisma/client";
import { createVNPayUrl } from "../utils/vnpay.js";
import { env } from "../config/env.js";

export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
}

export interface CreateOrderInput {
  userId: number;
  recipientName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  paymentMethod: PaymentMethod;
  items: CreateOrderItemInput[];
  voucherCode?: string;
  usePoints?: boolean;
  pointsToUse?: number;
  note?: string;
  clientIp?: string;
}

export class OrderService {
  async createOrder(input: CreateOrderInput) {
    if (!input.items || input.items.length === 0) {
      throw new Error("Giỏ hàng của bạn đang trống");
    }

    // 1. Fetch products from DB
    const productIds = input.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { preorderBatches: { where: { status: "OPEN" } } },
    });

    if (products.length !== productIds.length) {
      throw new Error("Một số sản phẩm không tồn tại hoặc đã ngừng kinh doanh");
    }

    // 2. Calculate subtotal & check pre-order
    let subtotal = 0;
    let isPreorderOrder = false;

    const orderItemsData = input.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.status === "PRE_ORDER") {
        isPreorderOrder = true;
      }

      const unitPrice = Number(product.price);
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      return {
        productId: product.id,
        preorderBatchId: product.preorderBatches?.[0]?.id || null,
        quantity: item.quantity,
        unitPrice,
        subtotal: itemSubtotal,
      };
    });

    // 3. Shipping fee calculation (Free for orders >= 1,000,000 VND, else 35,000 VND)
    let shippingFee = subtotal >= 1000000 ? 0 : 35000;

    // 4. Voucher calculation
    let discountAmount = 0;
    let voucherId: number | null = null;

    if (input.voucherCode) {
      const voucher = await prisma.voucher.findUnique({
        where: { code: input.voucherCode.toUpperCase().trim() },
      });

      if (voucher && voucher.isActive) {
        const now = new Date();
        if (now >= voucher.startDate && now <= voucher.endDate) {
          if (subtotal >= Number(voucher.minOrderAmount)) {
            voucherId = voucher.id;
            if (voucher.type === "PERCENTAGE") {
              const calcDiscount = (subtotal * Number(voucher.value)) / 100;
              discountAmount = voucher.maxDiscount
                ? Math.min(calcDiscount, Number(voucher.maxDiscount))
                : calcDiscount;
            } else {
              discountAmount = Number(voucher.value);
            }
          }
        }
      }
    }

    // 5. Otaku Points calculation (1 point = 1,000 VND discount)
    let pointsUsed = 0;
    let pointsDiscount = 0;
    if (input.usePoints || (input.pointsToUse && input.pointsToUse > 0)) {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: { otakuPoints: true },
      });
      if (user && user.otakuPoints > 0) {
        const maxPointsAvailable = user.otakuPoints;
        const requestedPoints = input.pointsToUse
          ? Math.min(input.pointsToUse, maxPointsAvailable)
          : maxPointsAvailable;
        const maxApplicablePoints = Math.floor(
          Math.max(0, subtotal + shippingFee - discountAmount) / 1000
        );
        pointsUsed = Math.max(0, Math.min(requestedPoints, maxApplicablePoints));
        pointsDiscount = pointsUsed * 1000;
      }
    }

    const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount - pointsDiscount);

    // 6. Generate unique Order Code: AKB-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `AKB-${dateStr}-${randomSuffix}`;

    // 7. Find or create delivery Address
    let address = await prisma.address.findFirst({
      where: {
        userId: input.userId,
        recipientName: input.recipientName,
        phone: input.phone,
        province: input.province,
        district: input.district,
        ward: input.ward,
        streetAddress: input.streetAddress,
      },
    });

    if (!address) {
      address = await prisma.address.create({
        data: {
          userId: input.userId,
          recipientName: input.recipientName,
          phone: input.phone,
          province: input.province,
          district: input.district,
          ward: input.ward,
          streetAddress: input.streetAddress,
        },
      });
    }

    // 8. Create Order in Database
    const order = await prisma.order.create({
      data: {
        orderCode,
        userId: input.userId,
        addressId: address.id,
        type: isPreorderOrder ? OrderType.PREORDER : OrderType.NORMAL,
        subtotal,
        shippingFee,
        discountAmount,
        totalAmount,
        pointsUsed,
        pointsDiscount,
        paymentMethod: input.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        orderStatus: OrderStatus.PENDING,
        voucherId,
        note: input.note || null,
        items: {
          create: orderItemsData,
        },
        history: {
          create: {
            toStatus: OrderStatus.PENDING,
            note: "Đơn hàng được khởi tạo",
            changedBy: input.userId,
          },
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, slug: true, images: { take: 1 } },
            },
          },
        },
        address: true,
      },
    });

    // Deduct user's points if used
    if (pointsUsed > 0) {
      await prisma.user.update({
        where: { id: input.userId },
        data: { otakuPoints: { decrement: pointsUsed } },
      });
      await prisma.pointTransaction.create({
        data: {
          userId: input.userId,
          orderId: order.id,
          type: "SPEND",
          points: pointsUsed,
          description: `Sử dụng ${pointsUsed} điểm Otaku cho đơn hàng ${order.orderCode}`,
        },
      });
    }

    // 8. If VNPay payment method, generate VNPay URL
    let paymentUrl: string | null = null;
    if (input.paymentMethod === PaymentMethod.VNPAY) {
      paymentUrl = createVNPayUrl({
        tmnCode: env.VNPAY.TMN_CODE,
        hashSecret: env.VNPAY.HASH_SECRET,
        vnpUrl: env.VNPAY.URL,
        returnUrl: env.VNPAY.RETURN_URL,
        orderCode: order.orderCode,
        amount: totalAmount,
        orderInfo: `Thanh toán đơn hàng ${order.orderCode} - Akiba Store`,
        ipAddr: input.clientIp || "127.0.0.1",
      });
    }

    return {
      order,
      paymentUrl,
    };
  }

  async getMyOrders(userId: number) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: { select: { imageUrl: true }, take: 1 },
              },
            },
          },
        },
        address: true,
      },
    });
  }

  async getOrderByCode(orderCode: string, userId?: number, userRole?: Role) {
    const where: any = { orderCode };
    if (userRole !== Role.ADMIN && userRole !== Role.STAFF && userId) {
      where.userId = userId;
    }

    const order = await prisma.order.findUnique({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                scale: true,
                images: { select: { imageUrl: true }, take: 1 },
              },
            },
          },
        },
        address: true,
        voucher: true,
        history: {
          orderBy: { createdAt: "asc" },
        },
        transactions: true,
      },
    });

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    return order;
  }
}

export const orderService = new OrderService();
export default orderService;

