import prisma from "../config/prisma.js";
import { verifyVNPayReturn } from "../utils/vnpay.js";
import { env } from "../config/env.js";
import { PaymentStatus, OrderStatus, PaymentMethod, PaymentTransactionType, PaymentTransactionStatus } from "@prisma/client";

export class PaymentService {
  async handleVNPayReturn(query: Record<string, any>) {
    const { isSuccess, isValidChecksum, orderCode, transactionNo } = verifyVNPayReturn(
      query,
      env.VNPAY.HASH_SECRET
    );

    if (!isValidChecksum) {
      throw new Error("Chữ ký bảo mật không hợp lệ (Checksum verification failed)");
    }

    const order = await prisma.order.findUnique({
      where: { orderCode },
    });

    if (!order) {
      throw new Error(`Không tìm thấy đơn hàng mã ${orderCode}`);
    }

    // Check if already processed
    if (order.paymentStatus === PaymentStatus.FULLY_PAID) {
      return { order, isSuccess: true, message: "Đơn hàng đã được thanh toán trước đó" };
    }

    const amount = Number(query.vnp_Amount) / 100;

    // Record Payment Transaction
    await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        transactionCode: transactionNo || `TXN-${Date.now()}`,
        provider: PaymentMethod.VNPAY,
        amount,
        type: PaymentTransactionType.FULL_PAYMENT,
        status: isSuccess ? PaymentTransactionStatus.SUCCESS : PaymentTransactionStatus.FAILED,
        rawResponse: JSON.stringify(query),
      },
    });

    if (isSuccess) {
      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.FULLY_PAID,
          orderStatus: OrderStatus.CONFIRMED,
          history: {
            create: {
              fromStatus: order.orderStatus,
              toStatus: OrderStatus.CONFIRMED,
              note: `Thanh toán thành công qua VNPay (Mã GD: ${transactionNo})`,
            },
          },
        },
      });

      return {
        order: updatedOrder,
        isSuccess: true,
        message: "Thanh toán qua cổng VNPay thành công!",
      };
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PENDING,
          history: {
            create: {
              fromStatus: order.orderStatus,
              toStatus: order.orderStatus,
              note: `Giao dịch thanh toán VNPay thất bại hoặc bị hủy (Mã lỗi: ${query.vnp_ResponseCode})`,
            },
          },
        },
      });

      return {
        order,
        isSuccess: false,
        message: "Thanh toán không thành công hoặc giao dịch đã bị hủy",
      };
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;

