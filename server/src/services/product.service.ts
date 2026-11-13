import prisma from "../config/prisma.js";
import { ProductStatus } from "@prisma/client";

export interface GetProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  seriesId?: number;
  characterId?: number;
  manufacturerId?: number;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price_asc" | "price_desc" | "rating" | "popular";
}

export class ProductService {
  async getProducts(query: GetProductsQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(query.limit) || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.categoryId) where.categoryId = Number(query.categoryId);
    if (query.seriesId) where.seriesId = Number(query.seriesId);
    if (query.characterId) where.characterId = Number(query.characterId);
    if (query.manufacturerId) where.manufacturerId = Number(query.manufacturerId);
    if (query.status) where.status = query.status;

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = Number(query.minPrice);
      if (query.maxPrice !== undefined) where.price.lte = Number(query.maxPrice);
    }

    let orderBy: any = { createdAt: "desc" };
    if (query.sortBy === "price_asc") orderBy = { price: "asc" };
    if (query.sortBy === "price_desc") orderBy = { price: "desc" };
    if (query.sortBy === "rating") orderBy = { avgRating: "desc" };
    if (query.sortBy === "popular") orderBy = { soldCount: "desc" };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          series: {
            select: { id: true, name: true, slug: true },
          },
          character: {
            select: { id: true, name: true, slug: true },
          },
          manufacturer: {
            select: { id: true, name: true, slug: true },
          },
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

  async getFeaturedProducts() {
    return prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        series: {
          select: { id: true, name: true, slug: true },
        },
        manufacturer: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        category: true,
        series: true,
        character: true,
        manufacturer: true,
        preorderBatches: {
          where: { status: "OPEN" },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { id: true, fullName: true, avatarUrl: true },
            },
            images: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product || !product.isActive) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    return product;
  }

  async addReview(
    userId: number,
    productSlug: string,
    data: {
      rating: number;
      comment?: string;
      orderId?: number;
      imageUrls?: string[];
    }
  ) {
    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
      select: { id: true },
    });

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    const rating = Math.max(1, Math.min(5, Math.round(Number(data.rating) || 5)));

    const review = await prisma.review.create({
      data: {
        userId,
        productId: product.id,
        orderId: data.orderId || null,
        rating,
        comment: data.comment?.trim() || null,
        isApproved: true,
        images: data.imageUrls && data.imageUrls.length > 0
          ? {
              create: data.imageUrls.map((url) => ({ imageUrl: url })),
            }
          : undefined,
      },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        images: true,
      },
    });

    // Recalculate average rating and review count
    const stats = await prisma.review.aggregate({
      where: { productId: product.id, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: product.id },
      data: {
        avgRating: stats._avg.rating || 0,
        reviewCount: stats._count.rating || 0,
      },
    });

    return review;
  }
}

export const productService = new ProductService();
export default productService;

