# Ecommerce Application

A full-stack E-commerce application built with **Next.js 14**, **Node.js**, **Express**, and **MongoDB**.

## 🚀 Features implemented
- **Full Database Sync:** All products, orders, cart items, and favorites are persisted in MongoDB.
- **Admin Dashboard:** Full control over Products (CRUD) and Orders (Pay/Status).
- **Authentication:** Firebase Auth (Phone/Email) + Custom JWT Backend Auth.
- **Cart & Favorites:** Synchronized across devices.
- **Notifications:** Toast notification system.
- **Responsive Design:** Mobile-first, dark/light mode supported.

---

## 🛠️ Getting Started

### 1. Backend Setup
1. Navigate to the `backend` folder:
    ```bash
    cd backend
    npm install
    ```
2. Configuration is already set in `.env` (MongoDB Atlas connected).
3. Seed Initial Data (Products & Admin):
    ```bash
    npm run seed        # Seeds 72 products
    npm run seed:admin  # Seeds defaults Admin User
    ```
4. Start the Server:
    ```bash
    npm run dev
    ```
   *running on port 5000*

### 2. Frontend Setup
1. Navigate to root (or split terminal):
    ```bash
    npm install
    ```
2. Start the App:
    ```bash
    npm run dev
    ```
   *running on port 3000*

---

## 🔑 Admin Setup
**Default Admin Credentials:**
- **Email:** `admin@ecommerce.com`
- **Password:** `Admin@123456`

To access the dashboard, Login via `/login` and select "Admin" toggle (or use these credentials).
**Dashboard URL:** `http://localhost:3000/admin/dashboard`

---

## 📦 Database Integration
Everything is connected to **MongoDB Cluster0**:
- **Products:** `/api/products` (CRUD)
- **Orders:** `/api/orders` (User & Admin views)
- **Users:** `/api/users` (Auth & Profile)
- **Favorites:** `/api/favorites`

---

## 🔔 Notification System
A custom notification context is available throughout the app:
```tsx
const { showSuccess, showError, showInfo } = useNotification();
showSuccess("Order Placed!");
```

---

## 🎨 Animations
GSAP is used for high-performance animations, particularly in:
- `app/components/Hero.tsx`
- `app/components/ProductCard.tsx`

---

## 📝 Recent Changes (Log)
- **Payment Status:** Admin can now toggle "Mark as Paid" mechanism.
- **Checkout:** Phone verification moved to the final step (Modal).
- **Favorites:** Heart icon correctly reflects database state.
- **Login:** Consolidated User/Admin flows.

---
*Generated Concolidated Readme - 2025*
