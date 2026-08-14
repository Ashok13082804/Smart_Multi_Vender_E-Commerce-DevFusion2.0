# ShopSwift — 10-Minute Quick Commerce & Multi-Vendor E-Commerce Platform

> **Hackathon Submission**  
> **Team Name:** Cold Forge  
> **Team Members:**  
> - **Chandhini S** — Frontend Developer  
> - **Ashok Kumar S** — Backend Developer  

---

## 🏆 Project Statement & Guidelines

Shortlisted participants will build a functional solution to an assigned problem statement within a fixed time window.
Problem statements will be released at the start of the round and will not be disclosed in advance.
Submissions must include working source code (GitHub repository) and a deployed build or installable package (APK for Android applications, TestFlight link for iOS applications) as applicable. Web-hosted demo links alone will not be accepted for mobile-based problem statements.
Evaluation will be based on functionality, technical execution, UI/UX quality, innovation, and adherence to the problem statement.
Use of pre-built templates or previously developed codebases beyond permitted boilerplate is strictly prohibited and will result in disqualification.
Teams found submitting incomplete, non-functional, or non-compliant builds will be eliminated from further rounds.

---

## 📌 Project Overview

**ShopSwift** (powered by **Chanbo AI Assistant**) is a production-grade full-stack e-commerce and 10–30 minute quick-commerce platform built with Next.js 15+, React 19, TypeScript, Vanilla CSS & Tailwind CSS, Python FastAPI, and SQLAlchemy ORM with persistent SQLite database engine.

---

## 🚀 Quick Start Commands

### macOS / Linux
```bash
./start_app.sh
```

### Windows
```cmd
start_app.bat
```

### Alternative NPM Command
```bash
npm run start:all
```

---

## 🤖 Chanbo AI Shopping Assistant

ShopSwift features **Chanbo AI Assistant**, an integrated AI shopping guide capable of:
- **Budget Planning**: Recommending family dinner bundles under ₹1,000.
- **Express Snacks Recommendation**: Curating 10-minute quick delivery items.
- **One-Click Bundle Add-to-Cart**: Adding recommended bundle items with item-specific images and pricing directly into your cart.

---

## 💳 Razorpay Payment Gateway Integration Guide

### 1. Obtaining Razorpay Test Mode Keys
1. Sign up or log into [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Switch to **Test Mode** from the top menu bar.
3. Go to **Settings -> API Keys -> Generate Test Key**.
4. Copy your `Key ID` and `Key Secret`.

### 2. Environment Variables (.env)
Create or update `.env` in the root directory:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxx"
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"
```

### 3. Setting Up Webhooks
In Razorpay Dashboard:
1. Go to **Settings -> Webhooks -> Add New Webhook**.
2. Set Webhook URL: `http://localhost:3000/api/payments/webhook` (or your public ngrok / production URL).
3. Set Secret: `RAZORPAY_WEBHOOK_SECRET` value from `.env`.
4. Select Events:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
   - `refund.created`
   - `refund.processed`
   - `refund.failed`

### 4. Razorpay Payment & Order Flow Architecture
```
Customer -> Cart -> Checkout (/checkout) -> /api/payments/create-order -> Razorpay SDK -> Customer Pays -> Server Verification (/api/payments/verify) -> Payment CAPTURED -> Order CONFIRMED
```

### 5. Switching to Production Mode
1. Replace `rzp_test_...` with Live Key ID (`rzp_live_...`) and Live Key Secret in `.env`.
2. Update Webhook URL to production HTTPS domain in Razorpay Dashboard.

---

## 🔑 Demo Account Credentials

| Role | Email Address | Password | Dashboard Route |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer1@shopswift.in` | `Password@123` | Cart, Checkout, Wishlist, Orders (`/account/orders`) |
| **Customer (Alt)** | `customer@shopswift.in` | `password123` | Cart, Profile (`/account`) |
| **Seller / Merchant** | `seller@shopswift.in` | `password123` | Seller Dashboard (`/seller`), Products, Orders |
| **Delivery Partner** | `delivery@shopswift.in` | `password123` | Delivery App (`/delivery`), OTP `1234` |
| **Admin** | `admin@shopswift.in` | `Admin@123` | Admin Reconciliation Dashboard (`/admin/orders`) |

---

## 🛠️ API Endpoints Summary

- **Create Razorpay Order**: `POST /api/payments/create-order`
- **Verify Signature**: `POST /api/payments/verify`
- **Webhook Handler**: `POST /api/payments/webhook`
- **Authorize Refund**: `POST /api/payments/refund`
- **Products Catalog**: `GET /api/products`
- **Cart Operations**: `GET /api/cart`, `POST /api/cart/add`, `POST /api/cart/remove`
