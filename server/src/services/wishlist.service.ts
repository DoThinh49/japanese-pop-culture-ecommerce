import prisma from "../config/prisma.js";

export class WishlistService {
  async getUserWishlist(userId: number) {
    const items = await prisma.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          include: {
            images: {
              take: 1,
              orderBy: { sortOrder: "asc" },
            },
            category: { select: { id: true, name: true, slug: true } },
            series: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    return items.map((item) => ({
      ...item.product,
      wishlistedAt: item.createdAt,
    }));
  }

  async getUserWishlistProductIds(userId: number) {
    const items = await prisma.wishlist.findMany({
      where: { userId },
      select: { productId: true },
    });
    return items.map((i) => i.productId);
  }

  async toggleWishlist(userId: number, productId: number) {
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
      return { isWishlisted: false, message: "Đã xóa khỏi danh sách yêu thích" };
    } else {
      await prisma.wishlist.create({
        data: {
          userId,
          productId,
        },
      });
      return { isWishlisted: true, message: "Đã thêm vào danh sách yêu thích" };
    }
  }

  async removeFromWishlist(userId: number, productId: number) {
    await prisma.wishlist.deleteMany({
      where: { userId, productId },
    });
    return { isWishlisted: false, message: "Đã xóa khỏi danh sách yêu thích" };
  }
}

export const wishlistService = new WishlistService();
export default wishlistService;

