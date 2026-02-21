# Antigravity Portfolio & Automation System

A robust, full-stack portfolio and business automation platform built with React (Vite), Node.js (Express), and MySQL.

## Features

### 🚀 Core System

- **Dynamic Frontend**: Products, Services, Projects, and Blog managed via Admin Panel.
- **Admin Dashboard**: Comprehensive management for all modules.
- **Authentication**: Secure JWT-based auth with Role-Based Access Control (RBAC).

### 💼 Business Automation

- **Pixel & Social Automation**:
  - Manage Facebook, TikTok, GA4, GTM pixels.
  - Custom Event Engine (Trigger -> Action rules).
  - Server-side event logging.
- **Live Chat**:
  - Real-time Socket.io chat system.
  - Admin Inbox for replying to visitors.
- **Newsletter**:
  - Campaign builder, subscriber management, email blasting.
- **Currency System**:
  - Live USD/BDT conversion using API.
  - Auto-updates via Cron / Admin fetch.
- **File Manager**:
  - Database-driven file tracking (File/Folder models).
  - Sync utility for existing assets.

### 💳 Commerce

- **Products**: Simple and variable products.
- **Payment Gateway**: SSLCommerz integration.
- **Orders**: Order tracking and status management.

## Tech Stack

- **Frontend**: React 18, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Sequelize ORM.
- **Database**: MySQL.
- **Real-time**: Socket.io.
- **Business Intelligence**: Dashboard with real-time metrics and activity logs.

## 🚀 Documentation

- **[Installation Guide (Local)](INSTALL.md)**
- **[Deployment Guide (Production)](DEPLOY.md)**
- **[Contributing Guidelines](CONTRIBUTING.md)**

1. **Install Dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

2. **Environment**
   Copy `.env.example` to `.env` and update credentials.

3. **Run**

   ```bash
   npm run dev:full
   ```

   (Runs both Vite and Server concurrently)

4. **Database Sync**
   The server automatically syncs models on start.
   To import existing files:

   ```bash
   node server/scripts/syncFiles.js
   ```

## License

MIT
