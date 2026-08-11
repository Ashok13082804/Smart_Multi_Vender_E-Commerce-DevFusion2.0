import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// High-quality category-specific image libraries (Unsplash curated commerce assets)
const IMAGE_LIBRARIES: Record<string, string[]> = {
  electronics: [
    "https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=800",
    "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800",
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
  ],
  smartphones: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800",
    "https://images.unsplash.com/photo-1574944985070-8f30c4397e3c?w=800",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
  ],
  laptops: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
  ],
  audio: [
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
  ],
  footwear: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
    "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
  ],
  grocery: [
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
    "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800",
    "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=800",
  ],
  pets: [
    "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800",
    "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800",
    "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800",
  ],
  home: [
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
  ],
  beauty: [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800",
  ],
  sports: [
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
  ],
};

async function main() {
  console.log("🌱 Starting NEXORA Full Marketplace Database Seed...");

  // Clean existing tables
  await prisma.reviewReply.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.sellerOrder.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.recentlyViewed.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("Password@123", 10);
  const adminHashedPassword = await bcrypt.hash("Admin@123", 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "Nexora Administrator",
      email: "admin@nexora.in",
      password: adminHashedPassword,
      phone: "+91 9876543210",
      role: "ADMIN",
      isVerified: true,
      rewardPoints: 500,
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // 2. Create 5 Merchants
  const sellersData = [
    {
      name: "Vikram Sharma",
      email: "seller.tech@nexora.in",
      storeName: "TechVerse Electronics",
      slug: "techverse-electronics",
      description: "Official store for high-end audio, mobile accessories, GaN chargers, and smart gadgets.",
      logo: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200",
      banner: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200",
      rating: 4.8,
    },
    {
      name: "Priya Patel",
      email: "seller.fashion@nexora.in",
      storeName: "TrendVault Fashion",
      slug: "trendvault-fashion",
      description: "Premium urban apparel, activewear, footwear, and handcrafted accessories.",
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
      banner: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200",
      rating: 4.7,
    },
    {
      name: "Rajesh Kumar",
      email: "seller.grocery@nexora.in",
      storeName: "FreshBazaar Essentials",
      slug: "freshbazaar-essentials",
      description: "Direct-from-farm organic staples, premium basmati rice, cold-pressed oils & daily essentials.",
      logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200",
      banner: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=1200",
      rating: 4.9,
    },
    {
      name: "Anita Roy",
      email: "seller.pets@nexora.in",
      storeName: "PawWorld Pet Store",
      slug: "pawworld-pet-store",
      description: "Nutritious pet food, durable toys, comfortable beds, and grooming supplies.",
      logo: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200",
      banner: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200",
      rating: 4.6,
    },
    {
      name: "Siddharth Verma",
      email: "seller.home@nexora.in",
      storeName: "LumiHome Decor",
      slug: "lumihome-decor",
      description: "Architectural lighting, ceramic dinner sets, smart lamps, and artisan home furnishings.",
      logo: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200",
      banner: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200",
      rating: 4.8,
    },
  ];

  const sellers = [];
  for (const sData of sellersData) {
    const user = await prisma.user.create({
      data: {
        name: sData.name,
        email: sData.email,
        password: hashedPassword,
        role: "SELLER",
        isVerified: true,
      },
    });

    const seller = await prisma.seller.create({
      data: {
        userId: user.id,
        storeName: sData.storeName,
        slug: sData.slug,
        description: sData.description,
        logo: sData.logo,
        banner: sData.banner,
        rating: sData.rating,
        isApproved: true,
        businessEmail: sData.email,
        businessPhone: "+91 98980" + Math.floor(10000 + Math.random() * 90000),
      },
    });
    sellers.push(seller);
  }

  // 3. Create Categories
  const categoriesData = [
    { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=400" },
    { name: "Smartphones", slug: "smartphones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" },
    { name: "Laptops", slug: "laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400" },
    { name: "Audio & Earbuds", slug: "audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400" },
    { name: "Footwear", slug: "footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
    { name: "Grocery & Food", slug: "grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400" },
    { name: "Pet Care", slug: "pets", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400" },
    { name: "Home & Kitchen", slug: "home", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400" },
    { name: "Beauty & Care", slug: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400" },
    { name: "Sports & Fitness", slug: "sports", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400" },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.create({ data: c });
    categoriesMap[c.slug] = cat.id;
  }

  // 4. Create Brands
  const brandsData = [
    { name: "AeroBeat", slug: "aerobeat" },
    { name: "UrbanTrail", slug: "urbantrail" },
    { name: "PureHarvest", slug: "pureharvest" },
    { name: "PawJoy", slug: "pawjoy" },
    { name: "NovaCharge", slug: "novacharge" },
    { name: "LumiHome", slug: "lumihome" },
    { name: "TerraCraft", slug: "terracraft" },
    { name: "FlexFit", slug: "flexfit" },
  ];

  const brandsMap: Record<string, string> = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.create({ data: b });
    brandsMap[b.slug] = brand.id;
  }

  // 5. Create 20 Customer Accounts with default addresses & carts
  const customerNames = [
    "Rahul Sharma", "Ananya Deshmukh", "Aarav Mehta", "Diya Iyer",
    "Karan Joshi", "Neha Kapoor", "Rohan Gupta", "Sneha Kulkarni",
    "Aditya Rao", "Pooja Malhotra", "Varun Bhat", "Kavya Menon",
    "Siddharth Patel", "Riya Singh", "Manish Pandey", "Isha Nambiar",
    "Harsh Vardhan", "Meera Sen", "Tanmay Bose", "Nisha Saxena"
  ];

  const customers = [];
  for (let i = 0; i < customerNames.length; i++) {
    const name = customerNames[i];
    const email = `customer${i + 1}@nexora.in`;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: `+91 987${1000000 + i}`,
        role: "CUSTOMER",
        isVerified: true,
        rewardPoints: Math.floor(Math.random() * 300),
      },
    });

    await prisma.address.create({
      data: {
        userId: user.id,
        name,
        phone: user.phone || "+91 9876543210",
        type: i % 3 === 0 ? "WORK" : "HOME",
        street: `${101 + i}, Park View Residency, MG Road`,
        city: i % 2 === 0 ? "Bengaluru" : "Mumbai",
        state: i % 2 === 0 ? "Karnataka" : "Maharashtra",
        zipCode: i % 2 === 0 ? "560001" : "400001",
        isDefault: true,
      },
    });

    await prisma.cart.create({ data: { userId: user.id } });
    await prisma.wishlist.create({ data: { userId: user.id } });
    customers.push(user);
  }

  // 6. Create Seed Products with DISTINCT Images & Realistic Descriptions
  const catalogTemplate = [
    // Audio
    { name: "AeroBeat Pro ANC Earbuds", category: "audio", brand: "aerobeat", price: 2499, orig: 4999, imgIdx: 0, desc: "35dB Active Noise Cancellation with 30-hour battery life and dual mic clear calls." },
    { name: "AeroBeat Studio Wireless Headphones", category: "audio", brand: "aerobeat", price: 4999, orig: 8999, imgIdx: 1, desc: "Hi-Res titanium driver over-ear headphones with ultra-soft memory foam ear cups." },
    { name: "AeroBeat Flex Neckband Earphones", category: "audio", brand: "aerobeat", price: 1299, orig: 2499, imgIdx: 2, desc: "Magnetic earbuds with fast charging giving 10 hours playback in 10 minutes." },
    { name: "AeroBeat SoundBoom Portable Speaker", category: "audio", brand: "aerobeat", price: 3199, orig: 5999, imgIdx: 3, desc: "IPX7 waterproof 20W Bluetooth speaker with deep bass radiator." },

    // Electronics & Chargers
    { name: "NovaCharge 65W GaN Dual Port Wall Charger", category: "electronics", brand: "novacharge", price: 1899, orig: 2999, imgIdx: 0, desc: "Ultra-compact GaN fast charger for MacBooks, laptops, and smartphones." },
    { name: "PulseFit AMOLED Bluetooth Smartwatch", category: "electronics", brand: "aerobeat", price: 2999, orig: 5999, imgIdx: 1, desc: "Always-on 1.43' AMOLED smartwatch with SpO2 and heart rate monitor." },
    { name: "NovaCharge 20000mAh Power Bank", category: "electronics", brand: "novacharge", price: 1699, orig: 2999, imgIdx: 2, desc: "22.5W Fast Charging power bank with triple output ports and LED digital gauge." },
    { name: "NovaCharge Braided Type-C to Type-C Cable", category: "electronics", brand: "novacharge", price: 399, orig: 799, imgIdx: 3, desc: "100W PD charging 2-meter nylon braided tangle-free cable." },

    // Laptops & Mobile
    { name: "AeroTech Ultrabook 14' Intel i7 16GB", category: "laptops", brand: "novacharge", price: 64999, orig: 84999, imgIdx: 0, desc: "Slim magnesium body laptop with 14-inch 2.8K OLED display and All-Day battery." },
    { name: "NovaPhone Pro 5G 256GB Sapphire", category: "smartphones", brand: "novacharge", price: 32999, orig: 44999, imgIdx: 0, desc: "120Hz AMOLED display with 108MP OIS triple camera and 67W fast charging." },

    // Footwear
    { name: "UrbanTrail Mesh Running Shoes", category: "footwear", brand: "urbantrail", price: 2199, orig: 3999, imgIdx: 0, desc: "Lightweight breathable knit mesh running shoes with EVA cushioning." },
    { name: "UrbanTrail Leather Derby Formal Shoes", category: "footwear", brand: "urbantrail", price: 2999, orig: 4999, imgIdx: 1, desc: "Genuine leather handcrafted oxford formal shoes with cushioned footbed." },
    { name: "UrbanTrail All-Terrain Outdoor Boots", category: "footwear", brand: "urbantrail", price: 3499, orig: 5999, imgIdx: 2, desc: "Waterproof ankle hiking boots with high-traction rubber lug sole." },
    { name: "UrbanTrail Comfort Foam Slides", category: "footwear", brand: "urbantrail", price: 799, orig: 1499, imgIdx: 3, desc: "Anti-slip cloud foam slides for home and beach casual wear." },

    // Fashion
    { name: "FlexFit Dry-Tech Workout T-Shirt", category: "fashion", brand: "flexfit", price: 799, orig: 1499, imgIdx: 0, desc: "Quick-dry moisture wicking athletic t-shirt for intense training sessions." },
    { name: "UrbanTrail Canvas Travel Backpack 30L", category: "fashion", brand: "urbantrail", price: 1999, orig: 3499, imgIdx: 1, desc: "Retro heavy-duty canvas travel backpack with 15.6' padded laptop sleeve." },
    { name: "FlexFit Fleece Full-Zip Hoodie", category: "fashion", brand: "flexfit", price: 1499, orig: 2799, imgIdx: 2, desc: "Warm brushed cotton fleece hoodie with adjustable drawstrings." },
    { name: "UrbanTrail Slim-Fit Denim Jeans", category: "fashion", brand: "urbantrail", price: 1799, orig: 2999, imgIdx: 3, desc: "Stretchable indigo denim jeans with classic 5-pocket styling." },

    // Grocery
    { name: "PureHarvest Royal Basmati Rice 5kg", category: "grocery", brand: "pureharvest", price: 649, orig: 899, imgIdx: 0, desc: "Extra-long grain aged aromatic royal basmati rice from Himalayan foothills." },
    { name: "PureHarvest Cold-Pressed Mustard Oil 1L", category: "grocery", brand: "pureharvest", price: 240, orig: 320, imgIdx: 1, desc: "Traditional Kachi Ghani cold-pressed mustard oil rich in Omega-3." },
    { name: "PureHarvest Organic Raw Honey 500g", category: "grocery", brand: "pureharvest", price: 399, orig: 550, imgIdx: 2, desc: "Unfiltered 100% natural wild forest honey naturally rich in enzymes." },
    { name: "PureHarvest Whole Roasted Almonds 500g", category: "grocery", brand: "pureharvest", price: 499, orig: 750, imgIdx: 3, desc: "Crunchy premium California almonds packed in resealable pouch." },

    // Pets
    { name: "PawJoy Chicken & Rice Adult Dog Food 3kg", category: "pets", brand: "pawjoy", price: 1199, orig: 1699, imgIdx: 0, desc: "High-protein dry kibble formulated with real deboned chicken and brown rice." },
    { name: "PawJoy Interactive Feather Wand Cat Toy", category: "pets", brand: "pawjoy", price: 299, orig: 499, imgIdx: 1, desc: "Teaser wand toy with natural feathers and bell for active indoor exercise." },
    { name: "PawJoy Orthopedic Memory Foam Pet Bed", category: "pets", brand: "pawjoy", price: 1899, orig: 2999, imgIdx: 2, desc: "Washable plush bolster dog bed designed for joint support and sleep." },

    // Home
    { name: "LumiHome Touch Dimmable Table Lamp", category: "home", brand: "lumihome", price: 1699, orig: 2999, imgIdx: 0, desc: "Cordless rechargeable LED table lamp with 3 color temperatures." },
    { name: "TerraCraft Ceramic Dinnerware Set 12-Piece", category: "home", brand: "terracraft", price: 3499, orig: 5999, imgIdx: 1, desc: "Artisan matte stoneware dinner plates and bowls set for luxury dining." },
    { name: "LumiHome Smart RGB LED Light Strip 5M", category: "home", brand: "lumihome", price: 999, orig: 1999, imgIdx: 2, desc: "Wi-Fi enabled music sync LED ambient light strip compatible with Alexa." },

    // Beauty
    { name: "RadiantGlow Vitamin C Face Serum 30ml", category: "beauty", brand: "terracraft", price: 599, orig: 999, imgIdx: 0, desc: "Skin brightening antioxidant serum with Hyaluronic Acid for radiant glow." },

    // Sports
    { name: "FlexFit Anti-Slip Rubber Yoga Mat 6mm", category: "sports", brand: "flexfit", price: 899, orig: 1599, imgIdx: 0, desc: "High-density eco-friendly TPE yoga mat with alignment grid lines." },
  ];

  const createdProducts = [];
  for (let idx = 0; idx < catalogTemplate.length; idx++) {
    const item = catalogTemplate[idx];
    const catId = categoriesMap[item.category] || categoriesMap["electronics"];
    const brandId = brandsMap[item.brand] || brandsMap["aerobeat"];
    const seller = sellers[idx % sellers.length];
    
    // Pick distinct image array from library
    const lib = IMAGE_LIBRARIES[item.category] || IMAGE_LIBRARIES["electronics"];
    const mainImg = lib[item.imgIdx % lib.length];
    const secondaryImg = lib[(item.imgIdx + 1) % lib.length];
    const imageList = JSON.stringify([mainImg, secondaryImg]);

    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${100 + idx}`;

    const prod = await prisma.product.create({
      data: {
        name: item.name,
        slug,
        categoryId: catId,
        brandId,
        sellerId: seller.id,
        sku: `NX-${item.category.substring(0, 3).toUpperCase()}-${100 + idx}`,
        price: item.price,
        originalPrice: item.orig,
        discount: Math.round(((item.orig - item.price) / item.orig) * 100),
        stock: 15 + (idx * 7) % 45,
        rating: Number((4.1 + (idx % 9) * 0.1).toFixed(1)),
        reviewCount: 25 + idx * 6,
        soldCount: 80 + idx * 15,
        isFeatured: idx % 3 === 0,
        isFlashDeal: idx % 4 === 0,
        images: imageList,
        tags: JSON.stringify([item.category, item.brand, "quality", "popular"]),
        description: item.desc + "\n\nDesigned for longevity and utility. Verified and inspected by NEXORA merchant quality assurance.",
        shortDescription: item.desc,
      },
    });

    createdProducts.push(prod);

    await prisma.productVariant.create({
      data: {
        productId: prod.id,
        sku: `${prod.sku}-STD`,
        name: "Standard Edition",
        price: prod.price,
        originalPrice: prod.originalPrice,
        stock: prod.stock,
      },
    });
  }

  console.log(`✅ ${createdProducts.length} Seed Products created with DISTINCT category-specific images.`);

  // 7. Seed Reviews
  const reviewTexts = [
    "Extremely satisfied! Build quality is premium and battery backup is amazing.",
    "Fast delivery by NEXORA Express. Product works perfectly right out of the box.",
    "Good value for money. Packaging was sturdy and item arrived in mint condition.",
    "High quality materials. Meets all specifications described on the product page.",
  ];

  for (let i = 0; i < 15; i++) {
    const product = createdProducts[i % createdProducts.length];
    const customer = customers[i % customers.length];

    await prisma.review.create({
      data: {
        userId: customer.id,
        productId: product.id,
        rating: 4 + (i % 2),
        title: "Verified Purchase Review",
        comment: reviewTexts[i % reviewTexts.length],
        isVerified: true,
        helpful: 3 + i,
      },
    });
  }

  // 8. Seed Active Coupons
  const coupons = [
    { code: "NEXORA10", description: "10% Flat Discount on all items", discountType: "PERCENTAGE", discountValue: 10, maxDiscount: 500, minCartValue: 999, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    { code: "FLASH500", description: "Flat ₹500 OFF on orders above ₹2,999", discountType: "FLAT", discountValue: 500, minCartValue: 2999, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    { code: "WELCOME200", description: "Flat ₹200 OFF on First Order", discountType: "FLAT", discountValue: 200, minCartValue: 499, expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
  ];

  for (const c of coupons) {
    await prisma.coupon.create({ data: c });
  }

  // 9. Seed Customer Orders & Payments
  for (let o = 0; o < 6; o++) {
    const customer = customers[o % customers.length];
    const address = await prisma.address.findFirst({ where: { userId: customer.id } });
    const product1 = createdProducts[o % createdProducts.length];

    const order = await prisma.order.create({
      data: {
        orderNumber: `NX-2026-${1000 + o}`,
        customerId: customer.id,
        addressId: address!.id,
        subtotal: product1.price,
        shippingAmount: 99,
        totalAmount: product1.price + 99,
        status: o === 0 ? "CONFIRMED" : o === 1 ? "SHIPPED" : "DELIVERED",
        items: {
          create: [{
            productId: product1.id,
            price: product1.price,
            quantity: 1,
            totalPrice: product1.price,
          }],
        },
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: product1.price + 99,
        method: "UPI",
        status: "SUCCESS",
        transactionId: `TXN_NEXORA_${10000 + o}`,
      },
    });

    await prisma.shipment.create({
      data: {
        orderId: order.id,
        trackingNumber: `TRK-NEX-${5000 + o}`,
        carrier: "NEXORA Express",
        status: order.status,
        otp: "1234",
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log("\n🎉 Full NEXORA Marketplace Database Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
