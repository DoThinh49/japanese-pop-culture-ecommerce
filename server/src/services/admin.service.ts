import prisma from "../config/prisma.js";
import { OrderStatus, PaymentStatus, Role, ProductStatus, VoucherType, ProductCondition } from "@prisma/client";

export class AdminService {
  async getStats() {
    // 1. Total revenue
    const revenueAgg = await prisma.order.aggregate({
      where: {
        OR: [
          { paymentStatus: PaymentStatus.FULLY_PAID },
          { orderStatus: OrderStatus.COMPLETED },
          { orderStatus: OrderStatus.DELIVERED },
        ],
      },
      _sum: { totalAmount: true },
    });
    const totalRevenue = Number(revenueAgg._sum.totalAmount || 0);

    // 2. Counts
    const [totalOrders, totalProducts, totalCustomers] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: Role.CUSTOMER } }),
    ]);

    // 3. Orders by status
    const statusCounts = await prisma.order.groupBy({
      by: ["orderStatus"],
      _count: { id: true },
    });

    const ordersByStatus: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      SHIPPING: 0,
      DELIVERED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    statusCounts.forEach((item) => {
      ordersByStatus[item.orderStatus] = item._count.id;
    });

    // 4. Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, email: true } },
        items: {
          take: 2,
          include: { product: { select: { name: true } } },
        },
      },
    });

    // 5. Top selling products
    const topProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { soldCount: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        soldCount: true,
        stockQuantity: true,
        images: { take: 1, select: { imageUrl: true } },
      },
    });

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      ordersByStatus,
      recentOrders,
      topProducts,
    };
  }

  async getOrders(query: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    search?: string;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(query.limit) || 15));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) {
      where.orderStatus = query.status;
    }
    if (query.search) {
      where.OR = [
        { orderCode: { contains: query.search, mode: "insensitive" } },
        { user: { fullName: { contains: query.search, mode: "insensitive" } } },
        { user: { email: { contains: query.search, mode: "insensitive" } } },
        { address: { phone: { contains: query.search } } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, fullName: true, email: true, phone: true } },
          address: true,
          items: {
            include: {
              product: {
                select: { id: true, name: true, slug: true, images: { take: 1 } },
              },
            },
          },
        },
      }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateOrderStatus(
    orderId: number,
    newStatus: OrderStatus,
    note?: string,
    adminUserId?: number
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    const oldStatus = order.orderStatus;
    if (oldStatus === newStatus) {
      return order;
    }

    // Determine if payment status should be updated
    let newPaymentStatus = order.paymentStatus;
    if (
      (newStatus === OrderStatus.COMPLETED || newStatus === OrderStatus.DELIVERED) &&
      order.paymentStatus === PaymentStatus.PENDING
    ) {
      newPaymentStatus = PaymentStatus.FULLY_PAID;
    }

    // If order was cancelled and was paid, set to REFUNDED (or handle accordingly)
    if (newStatus === OrderStatus.CANCELLED && order.paymentStatus === PaymentStatus.FULLY_PAID) {
      newPaymentStatus = PaymentStatus.REFUNDED;
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Update order
      const o = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: newStatus,
          paymentStatus: newPaymentStatus,
          history: {
            create: {
              fromStatus: oldStatus,
              toStatus: newStatus,
              note: note || `Quản trị viên cập nhật trạng thái sang ${newStatus}`,
              changedBy: adminUserId,
            },
          },
        },
      });

      // 2. If completed for the first time, award Otaku points (1 point per 10,000 VND)
      if (newStatus === OrderStatus.COMPLETED && oldStatus !== OrderStatus.COMPLETED) {
        const pointsEarned = Math.floor(Number(order.totalAmount) / 10000);
        if (pointsEarned > 0) {
          await tx.user.update({
            where: { id: order.userId },
            data: { otakuPoints: { increment: pointsEarned } },
          });

          await tx.pointTransaction.create({
            data: {
              userId: order.userId,
              orderId: order.id,
              type: "EARN",
              points: pointsEarned,
              description: `Tích điểm Otaku từ đơn hàng ${order.orderCode}`,
            },
          });
        }
      }

      return o;
    });

    return updatedOrder;
  }

  async getProducts(query: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { sku: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.categoryId) {
      where.categoryId = Number(query.categoryId);
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true } },
          series: { select: { id: true, name: true } },
          manufacturer: { select: { id: true, name: true } },
          images: { orderBy: { sortOrder: "asc" } },
        },
      }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createProduct(data: {
    name: string;
    slug?: string;
    sku: string;
    description?: string;
    price: number;
    originalPrice?: number;
    depositPercentage?: number;
    stockQuantity: number;
    condition?: ProductCondition;
    scale?: string;
    material?: string;
    heightCm?: number;
    releaseDate?: string;
    status?: ProductStatus;
    isFeatured?: boolean;
    categoryId: number;
    seriesId?: number;
    characterId?: number;
    manufacturerId?: number;
    imageUrls?: string[];
  }) {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    return prisma.product.create({
      data: {
        name: data.name,
        slug,
        sku: data.sku,
        description: data.description || null,
        price: data.price,
        originalPrice: data.originalPrice || null,
        depositPercentage: data.depositPercentage ?? 30,
        stockQuantity: Number(data.stockQuantity) || 0,
        condition: data.condition || ProductCondition.NEW_SEALED,
        scale: data.scale || null,
        material: data.material || null,
        heightCm: data.heightCm || null,
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
        status: data.status || ProductStatus.IN_STOCK,
        isFeatured: Boolean(data.isFeatured),
        categoryId: Number(data.categoryId),
        seriesId: data.seriesId ? Number(data.seriesId) : null,
        characterId: data.characterId ? Number(data.characterId) : null,
        manufacturerId: data.manufacturerId ? Number(data.manufacturerId) : null,
        images:
          data.imageUrls && data.imageUrls.length > 0
            ? {
                create: data.imageUrls.map((url, idx) => ({
                  imageUrl: url,
                  sortOrder: idx,
                  isPrimary: idx === 0,
                })),
              }
            : undefined,
      },
      include: {
        category: true,
        series: true,
        manufacturer: true,
        images: true,
      },
    });
  }

  async updateProduct(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      originalPrice?: number;
      stockQuantity?: number;
      condition?: ProductCondition;
      scale?: string;
      material?: string;
      heightCm?: number;
      status?: ProductStatus;
      isFeatured?: boolean;
      isActive?: boolean;
      categoryId?: number;
      seriesId?: number;
      characterId?: number;
      manufacturerId?: number;
      imageUrls?: string[];
    }
  ) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice;
    if (data.stockQuantity !== undefined) updateData.stockQuantity = Number(data.stockQuantity);
    if (data.condition !== undefined) updateData.condition = data.condition;
    if (data.scale !== undefined) updateData.scale = data.scale;
    if (data.material !== undefined) updateData.material = data.material;
    if (data.heightCm !== undefined) updateData.heightCm = data.heightCm;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.categoryId !== undefined) updateData.categoryId = Number(data.categoryId);
    if (data.seriesId !== undefined) updateData.seriesId = data.seriesId ? Number(data.seriesId) : null;
    if (data.characterId !== undefined) updateData.characterId = data.characterId ? Number(data.characterId) : null;
    if (data.manufacturerId !== undefined) updateData.manufacturerId = data.manufacturerId ? Number(data.manufacturerId) : null;

    if (data.imageUrls && data.imageUrls.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      updateData.images = {
        create: data.imageUrls.map((url, idx) => ({
          imageUrl: url,
          sortOrder: idx,
          isPrimary: idx === 0,
        })),
      };
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        series: true,
        manufacturer: true,
        images: true,
      },
    });
  }

  async deleteProduct(id: number) {
    const orderItemsCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderItemsCount > 0) {
      // Soft delete
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
      return { message: "Sản phẩm đã có trong đơn hàng, đã chuyển sang trạng thái Ngừng kinh doanh" };
    }

    await prisma.product.delete({ where: { id } });
    return { message: "Xóa sản phẩm thành công" };
  }

  async getVouchers() {
    return prisma.voucher.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async createVoucher(data: {
    code: string;
    type?: VoucherType;
    value: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const code = data.code.toUpperCase().trim();
    const existing = await prisma.voucher.findUnique({ where: { code } });
    if (existing) {
      throw new Error("Mã khuyến mãi này đã tồn tại");
    }

    return prisma.voucher.create({
      data: {
        code,
        type: data.type || VoucherType.FIXED_AMOUNT,
        value: data.value,
        minOrderAmount: data.minOrderAmount || 0,
        maxDiscount: data.maxDiscount || null,
        usageLimit: data.usageLimit || null,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async toggleVoucher(id: number) {
    const voucher = await prisma.voucher.findUnique({ where: { id } });
    if (!voucher) throw new Error("Không tìm thấy voucher");

    return prisma.voucher.update({
      where: { id },
      data: { isActive: !voucher.isActive },
    });
  }

  async getUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        otakuPoints: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
    });
  }
}

export const adminService = new AdminService();
export default adminService;

