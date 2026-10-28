MyShop - MERN E-commerce App

A full-stack e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js). It has two roles: Admin (manages products and orders) and Customer (browses, adds to cart, places orders).

Features

Customer

Register and login (JWT authentication)
Browse products with search and category filter
Add to cart with quantity controls (cart is saved in localStorage)
Place orders with a delivery address
View own orders with status (pending, shipped, delivered, cancelled)

Admin

Product CRUD (add, view, edit, delete)
View all orders and update order status
Dashboard cards: total orders and revenue

General

Role-based access control (backend middleware plus protected frontend routes)
Stock reduces automatically when an order is placed
Prices are always taken from the database, not from the frontend
Responsive design (mobile, tablet, desktop) with hamburger menu
Tech Stack
Layer	Technology
Frontend	React (Vite), React Router, Axios, plain CSS
Backend	Node.js, Express
Database	MongoDB (Mongoose)
Auth	JWT, bcryptjs
Project Structure
Ecommerce/
  backend/
    config/db.js
    middleware/auth.js
    models/        User.js, Product.js, Order.js
    routes/        authRoutes.js, productRoutes.js, orderRoutes.js
    server.js
    .env
  frontend/
    src/
      api.js
      components/  Navbar.jsx, Footer.jsx, ProtectedRoute.jsx
      context/     AuthContext.jsx, CartContext.jsx
      pages/       Home, Login, Register, Cart, MyOrders
      pages/admin/ ProductList.jsx, OrderList.jsx
      App.jsx
Setup
Prerequisites
Node.js
MongoDB Community Server (running as a service)
MongoDB Compass (optional, to view the database)
1. Backend
bash
cd backend
npm install

Create a .env file inside backend/:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=any_long_random_secret

Run:

bash
npm run dev

You should see:

Server port 5000 pe chal raha hai
MongoDB connected: 127.0.0.1
2. Frontend
bash
cd frontend
npm install
npm run dev

Open http://localhost:5173

Demo Credentials (local testing only)
Role	Email	Password
Admin	admin@gmail.com	123456
Customer	customer@gmail.com	123456

These are dummy credentials for local development. Do not use real passwords in a public repository.

How to create these accounts

Anyone who registers is a customer by default. This is intentional, so nobody can make themselves admin from the signup form.

Customer: open /register and sign up with customer@gmail.com / 123456.

Admin:

Register admin@gmail.com / 123456 from /register
Open MongoDB Compass and connect to mongodb://127.0.0.1:27017
Go to ecommerce > users and edit that user
Change role from "customer" to "admin" (all lowercase, exactly admin)
Click Update
Logout in the app and login again (the old role is cached in the browser until you login again)
API Endpoints

Auth

POST /api/auth/register - create account
POST /api/auth/login - login, returns token

Products

GET /api/products - list all (public)
GET /api/products/:id - single product (public)
POST /api/products - create (admin)
PUT /api/products/:id - update (admin)
DELETE /api/products/:id - delete (admin)

Orders

POST /api/orders - place order (logged in)
GET /api/orders/my - own orders (logged in)
GET /api/orders - all orders (admin)
PUT /api/orders/:id - update status (admin)

Protected routes need this header:

Authorization: Bearer <token>
Future Improvements
Image upload (Cloudinary)
Product detail page
Razorpay payment integration
Deployment (Render, Vercel, MongoDB Atlas)
Reviews and ratings
License

This project is for learning and portfolio purposes.
