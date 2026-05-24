# 🚀 DISHFLOW MASTER API SPECIFICATIONS

This document is our team's official contract. All backend routers must listen for these exact URL endpoints and handle these exact data structures so the frontend works perfectly.

---

## 📂 1. RESTAURANT AUTHENTICATION

### 🔹 Fetch All Registered Restaurants
* **HTTP Method:** `GET`
* **URL Endpoint:** `/api/vendors/all`

### 🔹 Register New Vendor Account
* **HTTP Method:** `POST`
* **URL Endpoint:** `/api/vendors/register-owner`
* **Incoming Request Data (`req.body`):** email, password, restaurantName, country, city, location, currency

### 🔹 Owner Account Login
* **HTTP Method:** `POST`
* **URL Endpoint:** `/api/vendors/login-owner`
* **Incoming Request Data (`req.body`):** email, password

---

## 📂 2. MENU CONFIGURATION

### 🔹 Add Dish to Menu
* **HTTP Method:** `POST`
* **URL Endpoint:** `/api/vendors/add-food-flexible`
* **Incoming Request Data (`req.body`):** vendorId, name, basePrice, description, imageUrl, isPermanent, ingredients array

### 🔹 Wipe Daily Specials
* **HTTP Method:** `POST`
* **URL Endpoint:** `/api/vendors/clear-daily-menu`
* **Incoming Request Data (`req.body`):** vendorId

---

## 📂 3. CUSTOMER ORDERS

### 🔹 Place Customer Order
* **HTTP Method:** `POST`
* **URL Endpoint:** `/api/vendors/place-order`
* **Incoming Request Data (`req.body`):** vendorId, itemName, finalPrice, modifications, deliveryAddress

### 🔹 Live Stream Orders Pipeline
* **HTTP Method:** `GET`
* **URL Endpoint:** `/api/vendors/orders-stream`

### 🔹 Update Order Status
* **HTTP Method:** `POST`
* **URL Endpoint:** `/api/vendors/update-order-status`
* **Incoming Request Data (`req.body`):** orderId, newStatus