import { PrismaClient, Role, ProductCondition, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed database for NihoNex...");

  // 1. Clean existing records (in reverse relation order)
  await prisma.notification.deleteMany();
  await prisma.pointTransaction.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.reviewImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.preorderBatch.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.seriesCharacter.deleteMany();
  await prisma.character.deleteMany();
  await prisma.series.deleteMany();
  await prisma.category.deleteMany();
  await prisma.manufacturer.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned old data.");

  // 2. Seed Users
  const adminPassword = await bcrypt.hash("AdminPassword123@", 10);
  const userPassword = await bcrypt.hash("UserPassword123@", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@nihonex.vn",
      passwordHash: adminPassword,
      fullName: "Quản Trị Viên NihoNex",
      phone: "0901234567",
      role: Role.ADMIN,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "otaku@nihonex.vn",
      passwordHash: userPassword,
      fullName: "Nguyễn Văn Otaku",
      phone: "0987654321",
      role: Role.CUSTOMER,
      otakuPoints: 150,
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
    },
  });

  // Default address for customer
  await prisma.address.create({
    data: {
      userId: customer.id,
      recipientName: "Nguyễn Văn Otaku",
      phone: "0987654321",
      province: "Thành phố Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
      streetAddress: "123 Đường Lê Lợi",
      isDefault: true,
    },
  });

  console.log("👤 Created Admin and Customer accounts.");

  // 3. Seed Categories
  const catFigure = await prisma.category.create({
    data: {
      name: "Mô hình & Figure",
      slug: "mo-hinh-figure",
      description: "Scale figure, Nendoroid, Figma, Pop Up Parade chính hãng từ Nhật Bản",
      imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600",
      sortOrder: 1,
    },
  });

  const catManga = await prisma.category.create({
    data: {
      name: "Manga & Light Novel",
      slug: "manga-light-novel",
      description: "Truyện tranh Manga, Tiểu thuyết Light Novel bản quyền và Artbook sưu tầm",
      imageUrl: "https://images.unsplash.com/photo-1618365908648-e71bd5716cba?w=600",
      sortOrder: 2,
    },
  });

  const catMerch = await prisma.category.create({
    data: {
      name: "Phụ kiện Sưu tầm",
      slug: "phu-kien-suu-tam",
      description: "Standee mica Acrylic, Huy hiệu Can Badge, Shikishi, Móc khóa nhân vật",
      imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600",
      sortOrder: 3,
    },
  });

  const catGunpla = await prisma.category.create({
    data: {
      name: "Gunpla & Model Kit",
      slug: "gunpla-model-kit",
      description: "Mô hình lắp ráp nhựa Gundam chính hãng Bandai các cấp độ HG, RG, MG, PG",
      imageUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600",
      sortOrder: 4,
    },
  });

  const catApparel = await prisma.category.create({
    data: {
      name: "Thời trang",
      slug: "thoi-trang",
      description: "Áo thun Graphic Tees, Hoodie, Áo Haori truyền thống, Lót chuột và Đồ gia dụng",
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
      sortOrder: 5,
    },
  });

  console.log("📂 Created 5 Categories.");

  // 4. Seed Manufacturers
  const mfgGoodSmile = await prisma.manufacturer.create({
    data: {
      name: "Good Smile Company",
      slug: "good-smile-company",
      country: "Nhật Bản",
      websiteUrl: "https://www.goodsmile.com",
    },
  });

  const mfgBandai = await prisma.manufacturer.create({
    data: {
      name: "Bandai Spirits",
      slug: "bandai-spirits",
      country: "Nhật Bản",
      websiteUrl: "https://bandaispirits.co.jp",
    },
  });

  const mfgKotobukiya = await prisma.manufacturer.create({
    data: {
      name: "Kotobukiya",
      slug: "kotobukiya",
      country: "Nhật Bản",
      websiteUrl: "https://www.kotobukiya.co.jp",
    },
  });

  const mfgEstream = await prisma.manufacturer.create({
    data: {
      name: "eStream (SHIBUYA SCRAMBLE)",
      slug: "estream-shibuya-scramble",
      country: "Nhật Bản",
      websiteUrl: "https://shibuya-scramble-figure.com",
    },
  });

  console.log("🏭 Created 4 Manufacturers.");

  // 5. Seed Series (Anime / Manga Franchises)
  const seriesJJK = await prisma.series.create({
    data: {
      name: "Jujutsu Kaisen (Chú Thuật Hồi Chiến)",
      slug: "jujutsu-kaisen",
      origin: "Manga / Anime",
      releaseYear: 2018,
      description: "Bộ truyện shounen siêu nhiên đình đám sáng tác bởi Gege Akutami.",
    },
  });

  const seriesOP = await prisma.series.create({
    data: {
      name: "One Piece (Đảo Hải Tặc)",
      slug: "one-piece",
      origin: "Manga / Anime",
      releaseYear: 1997,
      description: "Huyền thoại phiêu lưu hải tặc của tác giả Eiichiro Oda.",
    },
  });

  const seriesSpyX = await prisma.series.create({
    data: {
      name: "Spy x Family",
      slug: "spy-x-family",
      origin: "Manga / Anime",
      releaseYear: 2019,
      description: "Gia đình điệp viên hài hước ấm áp của Tatsuya Endo.",
    },
  });

  const seriesGundam = await prisma.series.create({
    data: {
      name: "Mobile Suit Gundam",
      slug: "mobile-suit-gundam",
      origin: "Anime / Mecha",
      releaseYear: 1979,
      description: "Tượng đài thể loại Robot Mecha chiến tranh không gian Nhật Bản.",
    },
  });

  console.log("🎬 Created 4 Franchises/Series.");

  // 6. Seed Characters
  const charGojo = await prisma.character.create({
    data: {
      name: "Gojo Satoru",
      slug: "gojo-satoru",
      description: "Chú thuật sư mạnh nhất thời hiện đại, thầy giáo trường Chú thuật Tokyo.",
    },
  });

  const charLuffy = await prisma.character.create({
    data: {
      name: "Monkey D. Luffy",
      slug: "monkey-d-luffy",
      description: "Thuyền trưởng băng Mũ Rơm, người sở hữu sức mạnh Gear 5 Nika thần mặt trời.",
    },
  });

  const charAnya = await prisma.character.create({
    data: {
      name: "Anya Forger",
      slug: "anya-forger",
      description: "Cô bé có khả năng đọc suy nghĩ người khác, con gái nuôi nhà Forger.",
    },
  });

  // Link characters to series
  await prisma.seriesCharacter.createMany({
    data: [
      { seriesId: seriesJJK.id, characterId: charGojo.id },
      { seriesId: seriesOP.id, characterId: charLuffy.id },
      { seriesId: seriesSpyX.id, characterId: charAnya.id },
    ],
  });

  console.log("🦸 Created Characters and linked to Series.");

  // 7. Seed Products with Images
  // Product 1: Gojo Figure (Pre-order)
  const prodGojo = await prisma.product.create({
    data: {
      name: "Mô hình Gojo Satoru 1/7 Shibuya Incident Ver. - SHIBUYA SCRAMBLE",
      slug: "mo-hinh-gojo-satoru-1-7-shibuya-incident",
      sku: "FIG-JJK-GOJO-001",
      description: "Mô hình tỉ lệ 1/7 tuyệt đẹp tái hiện khoảnh khắc Gojo bung Vô Hạn tại ga Shibuya. Hiệu ứng nhựa trong suốt cao cấp cùng chi tiết sắc sảo chuẩn chính hãng eStream.",
      price: 7850000,
      originalPrice: 8500000,
      depositPercentage: 40,
      stockQuantity: 15,
      condition: ProductCondition.NEW_SEALED,
      scale: "1/7",
      material: "PVC, ABS, Resin",
      heightCm: 28.5,
      status: ProductStatus.PRE_ORDER,
      isFeatured: true,
      categoryId: catFigure.id,
      seriesId: seriesJJK.id,
      characterId: charGojo.id,
      manufacturerId: mfgEstream.id,
      avgRating: 5.0,
      reviewCount: 3,
    },
  });

  await prisma.productImage.createMany({
    data: [
      {
        productId: prodGojo.id,
        imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800",
        isPrimary: true,
        sortOrder: 1,
      },
      {
        productId: prodGojo.id,
        imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800",
        isPrimary: false,
        sortOrder: 2,
      },
    ],
  });

  // Pre-order batch for Gojo
  await prisma.preorderBatch.create({
    data: {
      productId: prodGojo.id,
      openDate: new Date(),
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
      estimatedArrival: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // +4 months
      maxQuantity: 20,
      currentQuantity: 5,
    },
  });

  // Product 2: Anya Nendoroid (In-stock)
  const prodAnya = await prisma.product.create({
    data: {
      name: "Nendoroid 1902 Anya Forger - SPY x FAMILY",
      slug: "nendoroid-1902-anya-forger",
      sku: "NEN-SPY-ANYA-1902",
      description: "Mô hình Nendoroid khớp cử động Anya Forger đi kèm 4 khuôn mặt biểu cảm huyền thoại (cười mỉm, 'Heh', khóc nhè, mắt sao lấp lánh) cùng chú gấu bông Chimera.",
      price: 1350000,
      originalPrice: 1450000,
      stockQuantity: 25,
      condition: ProductCondition.NEW_SEALED,
      scale: "Nendoroid (~10cm)",
      material: "PVC, ABS",
      heightCm: 10.0,
      status: ProductStatus.IN_STOCK,
      isFeatured: true,
      categoryId: catFigure.id,
      seriesId: seriesSpyX.id,
      characterId: charAnya.id,
      manufacturerId: mfgGoodSmile.id,
      avgRating: 4.9,
      reviewCount: 12,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: prodAnya.id,
      imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800",
      isPrimary: true,
      sortOrder: 1,
    },
  });

  // Product 3: Luffy Gear 5 Figure (In-stock)
  const prodLuffy = await prisma.product.create({
    data: {
      name: "Mô hình One Piece - Monkey D. Luffy Gear 5 Sun God Nika King of Artist",
      slug: "mo-hinh-luffy-gear-5-king-of-artist",
      sku: "FIG-OP-LUFFY-G5",
      description: "Mô hình King of Artist chính hãng Bandai Spirits tái hiện Thần Mặt Trời Nika với nụ cười sảng khoái và mái tóc mây bồng bềnh đặc trưng.",
      price: 650000,
      originalPrice: 720000,
      stockQuantity: 40,
      condition: ProductCondition.NEW_SEALED,
      scale: "Prize (~16cm)",
      material: "PVC, ABS",
      heightCm: 16.0,
      status: ProductStatus.IN_STOCK,
      isFeatured: true,
      categoryId: catFigure.id,
      seriesId: seriesOP.id,
      characterId: charLuffy.id,
      manufacturerId: mfgBandai.id,
      avgRating: 4.8,
      reviewCount: 8,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: prodLuffy.id,
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800",
      isPrimary: true,
      sortOrder: 1,
    },
  });

  // Product 4: RG Gundam Model Kit (In-stock)
  const prodGundam = await prisma.product.create({
    data: {
      name: "Mô hình lắp ráp Gunpla RG 1/144 Hi-Nu Gundam - Bandai",
      slug: "gunpla-rg-1-144-hi-nu-gundam",
      sku: "GUN-RG-HINU-036",
      description: "Kiệt tác dòng Real Grade (RG) với biên độ cử động vô đối, giáp tách lớp cực kỳ chi tiết, Fin Funnel có thể tách rời và tạo dáng bắn ấn tượng.",
      price: 1250000,
      originalPrice: 1350000,
      stockQuantity: 18,
      condition: ProductCondition.NEW_SEALED,
      scale: "RG 1/144",
      material: "PS, ABS, PP",
      heightCm: 15.0,
      status: ProductStatus.IN_STOCK,
      isFeatured: true,
      categoryId: catGunpla.id,
      seriesId: seriesGundam.id,
      manufacturerId: mfgBandai.id,
      avgRating: 5.0,
      reviewCount: 15,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: prodGundam.id,
      imageUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800",
      isPrimary: true,
      sortOrder: 1,
    },
  });

  // Product 5: Manga One Piece Tập 100 Bản Đặc Biệt
  const prodMangaOP = await prisma.product.create({
    data: {
      name: "Manga One Piece - Tập 100 (Bản Giới Hạn Kèm Bìa Áo Metalize & Bưu Thiếp)",
      slug: "manga-one-piece-tap-100-ban-dac-biet",
      sku: "MAN-OP-VOL100-LTD",
      description: "Tập kỷ niệm cột mốc 100 tập của kiệt tác One Piece từ tác giả Eiichiro Oda. Ấn bản đặc biệt đi kèm bìa áo kim loại óng ánh và bộ bưu thiếp độc quyền dành riêng cho nhà sưu tập.",
      price: 95000,
      originalPrice: 110000,
      stockQuantity: 50,
      condition: ProductCondition.NEW_SEALED,
      scale: "Bản in giấy cao cấp",
      material: "Giấy xốp nhập khẩu Nhật",
      status: ProductStatus.IN_STOCK,
      isFeatured: true,
      categoryId: catManga.id,
      seriesId: seriesOP.id,
      characterId: charLuffy.id,
      avgRating: 5.0,
      reviewCount: 22,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: prodMangaOP.id,
      imageUrl: "https://images.unsplash.com/photo-1618365908648-e71bd5716cba?w=800",
      isPrimary: true,
      sortOrder: 1,
    },
  });

  // Product 6: Standee Acrylic Gojo Satoru
  const prodStandee = await prisma.product.create({
    data: {
      name: "Standee Acrylic Gojo Satoru Vô Hạn Không Gian Lấp Lánh - MAPPA Official",
      slug: "standee-acrylic-gojo-satoru-vo-han-khong-gian",
      sku: "ACC-JJK-STANDEE-01",
      description: "Standee mica Acrylic chính hãng MAPPA Studios Nhật Bản với hiệu ứng tráng gương kim tuyến bắt sáng siêu nét, đế lồng khớp 2 tầng chắc chắn.",
      price: 185000,
      originalPrice: 220000,
      stockQuantity: 35,
      condition: ProductCondition.NEW_SEALED,
      scale: "Cao 16cm",
      material: "Acrylic mica trong suốt cao cấp",
      status: ProductStatus.IN_STOCK,
      isFeatured: true,
      categoryId: catMerch.id,
      seriesId: seriesJJK.id,
      characterId: charGojo.id,
      avgRating: 4.9,
      reviewCount: 9,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: prodStandee.id,
      imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800",
      isPrimary: true,
      sortOrder: 1,
    },
  });

  // Product 7: Áo Hoodie Jujutsu Kaisen Gojo Eyes (Thời trang)
  const prodHoodie = await prisma.product.create({
    data: {
      name: "Áo Hoodie Nỉ Bông Anime Jujutsu Kaisen - Gojo Satoru Eyes Oversize",
      slug: "ao-hoodie-anime-jujutsu-kaisen-gojo-eyes-oversize",
      sku: "APP-JJK-HOODIE-GOJO",
      description: "Áo hoodie chất liệu nỉ cotton 100% định lượng 380gsm dày dặn, hình in thêu mắt Gojo Satoru Lục Nhãn phát sáng ánh xanh dạ quang chuẩn phong cách Streetwear Tokyo Akihabara.",
      price: 490000,
      originalPrice: 550000,
      stockQuantity: 28,
      condition: ProductCondition.NEW_SEALED,
      scale: "Freesize Oversize (Dưới 85kg)",
      material: "Cotton nỉ bông 380gsm cao cấp",
      status: ProductStatus.IN_STOCK,
      isFeatured: true,
      categoryId: catApparel.id,
      seriesId: seriesJJK.id,
      characterId: charGojo.id,
      avgRating: 4.9,
      reviewCount: 18,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: prodHoodie.id,
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
      isPrimary: true,
      sortOrder: 1,
    },
  });

  // Product 8: Áo Thun One Piece Gear 5 Nika Graphic Tee (Thời trang)
  const prodTee = await prisma.product.create({
    data: {
      name: "Áo Thun Unisex One Piece Gear 5 Thần Mặt Trời Nika - Akiba Exclusive",
      slug: "ao-thun-one-piece-gear-5-than-mat-troi-nika",
      sku: "APP-OP-TEE-NIKA-01",
      description: "Áo thun phong cách Harajuku form rộng trẻ trung, chất vải 100% cotton 2 chiều 250gsm co giãn thoải mái, công nghệ in kéo lụa thủ công Nhật Bản không bong tróc.",
      price: 290000,
      originalPrice: 350000,
      stockQuantity: 45,
      condition: ProductCondition.NEW_SEALED,
      scale: "Size M / L / XL",
      material: "100% Cotton 250gsm",
      status: ProductStatus.IN_STOCK,
      isFeatured: true,
      categoryId: catApparel.id,
      seriesId: seriesOP.id,
      characterId: charLuffy.id,
      avgRating: 5.0,
      reviewCount: 14,
    },
  });

  await prisma.productImage.create({
    data: {
      productId: prodTee.id,
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
      isPrimary: true,
      sortOrder: 1,
    },
  });

  // 8. Seed Vouchers
  await prisma.voucher.createMany({
    data: [
      {
        code: "WELCOMEOTAKU",
        type: "PERCENTAGE",
        value: 10, // 10%
        minOrderAmount: 500000,
        maxDiscount: 100000,
        usageLimit: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
      {
        code: "FREESHIP50K",
        type: "FIXED_AMOUNT",
        value: 50000, // 50k VND
        minOrderAmount: 1000000,
        usageLimit: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log("🎟️ Created Vouchers.");
  console.log("🎉 Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

