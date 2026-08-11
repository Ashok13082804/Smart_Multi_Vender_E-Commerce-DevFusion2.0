# NEXORA — AI Commerce & Vendor Intelligence Platform

> **"Commerce that thinks ahead."**

NEXORA is a production-quality multi-vendor AI e-commerce platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma + SQLite/PostgreSQL**. All AI/ML, natural language search, voice recognition, recommendation scoring, and inventory prediction capabilities are implemented locally — **no external paid API keys required**.

---

## 🌟 Key Features

1. **Natural Language Search (NLP)**  
   - Custom deterministic NLP engine (`searchUnderstandingService.ts`) extracts intent, budget limits (e.g. *"under 2500"*), colors, brands, and categories from natural queries.

2. **Web Speech Voice Search**  
   - Browser-native Web Speech API microphone search modal with real-time waveform animation and auto-submission.

3. **AI Product Recommendation Engine**  
   - Multi-factor recommendation matrix balancing Content Similarity (35%), User Behavior (30%), Popularity (20%), Rating (10%), and Freshness (5%).

4. **Multi-Vendor Order Splitting**  
   - Single customer checkouts automatically split into parent and merchant-specific sub-orders with independent status management.

5. **AI Inventory Intelligence & Demand Forecasting**  
   - Statistical moving average model predicts 7-day and 30-day product demand, stock-out timelines, and automated reorder alerts for sellers.

6. **AI Product Copywriter & SEO Generator**  
   - Local template engine generates short/long descriptions, bullet points, SEO meta titles, and keywords from product specs.

7. **Local Payment Simulator**  
   - Complete checkout simulator supporting instant simulated UPI (GPay/PhonePe), Credit/Debit Card, and Cash on Delivery with full signature verification and status transitions.

8. **RBAC Security & Fraud Risk Scoring**  
   - Server-side role-based access control (CUSTOMER, SELLER, ADMIN, DELIVERY_PARTNER) and risk scoring for orders exceeding suspicious threshold combinations.

---

## 🔑 Seeded Demo Credentials (Instant Login)

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@nexora.in` | `Admin@123` | Platform GMV, Governance, Audit Logs |
| **Seller** | `seller.tech@nexora.in` | `Password@123` | TechVerse Storefront, AI Copywriter, Inventory |
| **Customer** | `customer1@nexora.in` | `Password@123` | Shopping, Cart, Checkout, Order Tracking |

---

## 🚀 Quick Start (Local Execution)

```bash
# 1. Install dependencies
npm install

# 2. Push database schema (creates local SQLite database prisma/dev.db)
npx prisma db push

# 3. Seed sample marketplace data (40+ products, 5 sellers, 20 customers, 11 categories)
npx ts-node prisma/seed.ts

# 4. Start Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Architecture

```
Smart_Multi_Vender_E-Commerce-DevFusion/
├── prisma/
│   ├── schema.prisma       # Relational models & SQLite configuration
│   └── seed.ts             # 100+ items seed script
├── src/
│   ├── ai/                 # Local AI & ML Engines
│   │   ├── nlp/            # Natural Language Search Parser
│   │   ├── recommendation/ # Multi-factor Recommendation Engine
│   │   ├── descriptions/   # AI Product Description Generator
│   │   ├── inventory/      # Demand Forecasting & Stock-out Alerts
│   │   └── security/       # Order Fraud Risk Scoring
│   ├── app/                # Next.js App Router (Public, Auth, Customer, Seller, Admin)
│   ├── components/         # Reusable UI & Navbar & Voice Search Modal
│   ├── lib/                # Auth (JWT & Bcrypt), DB client, Zod schemas, Utils
│   └── services/           # Products, Cart, Orders, Payments, Shipping
└── package.json
```

---

## 📜 License
Developed for Hackathon Demonstration. All rights reserved.
