# Professional Installation Guide

Thank you for choosing the **Antigravity Portfolio & Automation System**. This guide will walk you through the process of setting up the application on your server.

> [!IMPORTANT]
> This application requires **Node.js (v18+)** and **MySQL (v5.7+)**. We recommend using **Laragon** for the best experience on Windows.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js & npm**: [Download here](https://nodejs.org/)
2. **Laragon (Windows)**: [Download here](https://laragon.org/download/)
3. **Git**: [Download here](https://git-scm.com/)

---

## 🚀 Installation Steps

### 1. Clone the Repository

Open your terminal or Laragon's terminal and run:

```bash
git clone https://github.com/mahmudulhassan-dev/myprofile.git
cd myprofile
```

### 2. Install Dependencies

Run the following command to install all required packages:

```bash
npm install --legacy-peer-deps
```

> [!NOTE]
> We use `--legacy-peer-deps` to ensure compatibility with all UI components.

### 3. Environment Configuration

- Locate the `.env.example` file in the root directory.
- Create a copy and rename it to `.env`.
- Open `.env` and update your database credentials:

  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASS=               # Leave blank for Laragon default
  DB_NAME=portfolio_db
  ```

### 4. Database Setup

- Open **Laragon** and click **Start All**.
- Click **Database** (or use phpMyAdmin) and create a new database named `portfolio_db`.
- The application will automatically synchronize the tables upon the first run.

### 5. Start the Application

To start both the frontend and backend simultaneously, run:

```bash
npm run dev:full
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend/Admin**: [http://localhost:5000](http://localhost:5000)

---

## ⚙️ Post-Installation

### Admin Access

- Navigate to `/login` to access the admin panel.
- (Optional) Use the `seed.js` script to populate initial data if needed.

### File Manager Sync

If you have existing files in the `uploads` folder, sync them to the database by running:

```bash
node scripts/syncFiles.js
```

---

## ❓ Troubleshooting

> [!TIP]
> **Port Conflict**: If port 5000 or 5173 is already in use, change the `PORT` in your `.env` file.

> [!WARNING]
> **Database Connection**: Ensure MySQL is running in Laragon before starting the server.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
