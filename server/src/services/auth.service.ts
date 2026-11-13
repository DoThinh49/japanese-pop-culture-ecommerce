import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  TokenPayload,
} from "../utils/jwt.js";
import { Role } from "@prisma/client";

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }) {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email này đã được đăng ký trong hệ thống");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        phone: data.phone || null,
        role: Role.CUSTOMER,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        otakuPoints: true,
        createdAt: true,
      },
    });

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return { user, accessToken, refreshToken };
  }

  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Email hoặc mật khẩu không chính xác");
    }

    if (!user.isActive) {
      throw new Error("Tài khoản của bạn đã bị khóa, vui lòng liên hệ hỗ trợ");
    }

    if (!user.passwordHash) {
      throw new Error("Tài khoản này được đăng nhập qua Google, vui lòng đăng nhập bằng Google");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Email hoặc mật khẩu không chính xác");
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
      otakuPoints: user.otakuPoints,
      createdAt: user.createdAt,
    };

    return { user: safeUser, accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.isActive) {
        throw new Error("Người dùng không tồn tại hoặc đã bị khóa");
      }

      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new Error("Refresh token không hợp lệ hoặc đã hết hạn");
    }
  }

  async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        otakuPoints: true,
        authProvider: true,
        createdAt: true,
        addresses: {
          orderBy: { isDefault: "desc" },
        },
      },
    });

    if (!user) {
      throw new Error("Không tìm thấy thông tin người dùng");
    }

    return user;
  }

  async updateProfile(
    userId: number,
    data: { fullName?: string; phone?: string | null; avatarUrl?: string | null }
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        otakuPoints: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async changePassword(
    userId: number,
    data: { currentPassword: string; newPassword: string }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.passwordHash) {
      throw new Error("Người dùng không hợp lệ");
    }

    const isPasswordValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Mật khẩu hiện tại không đúng");
    }

    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return { message: "Đổi mật khẩu thành công" };
  }

  async addAddress(
    userId: number,
    data: {
      recipientName: string;
      phone: string;
      province: string;
      district: string;
      ward: string;
      streetAddress: string;
      isDefault?: boolean;
    }
  ) {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const count = await prisma.address.count({ where: { userId } });
    const isFirst = count === 0;

    return prisma.address.create({
      data: {
        userId,
        recipientName: data.recipientName,
        phone: data.phone,
        province: data.province,
        district: data.district,
        ward: data.ward,
        streetAddress: data.streetAddress,
        isDefault: data.isDefault ?? isFirst,
      },
    });
  }

  async updateAddress(
    userId: number,
    addressId: number,
    data: {
      recipientName?: string;
      phone?: string;
      province?: string;
      district?: string;
      ward?: string;
      streetAddress?: string;
      isDefault?: boolean;
    }
  ) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new Error("Không tìm thấy địa chỉ");
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  async deleteAddress(userId: number, addressId: number) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new Error("Không tìm thấy địa chỉ");
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    return { message: "Xóa địa chỉ thành công" };
  }

  async setDefaultAddress(userId: number, addressId: number) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new Error("Không tìm thấy địa chỉ");
    }

    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}

export const authService = new AuthService();
export default authService;

