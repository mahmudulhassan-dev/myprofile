# Enterprise Deployment Guide

This guide provides professional instructions for deploying the **Antigravity Portfolio & Automation System** to production environments.

---

## 🟢 Option 1: Shared Hosting (cPanel / LiteSpeed)

Most shared hosts (like Bluehost, Namecheap, HostGator) provide a "Setup Node.js App" tool.

### 1. Database Setup

- Login to **cPanel** > **MySQL® Databases**.
- Create a new database (e.g., `user_portfolio`).
- Create a database user and assign it to the database with **All Privileges**.
- Open **phpMyAdmin**, select your database, and import your SQL if you have one (or let the app auto-sync on first run).

### 2. File Upload

- Compress your project folder (excluding `node_modules` and `.git`).
- Use **File Manager** to upload and extract it into a folder (e.g., `/home/user/portfolio`).

### 3. Node.js Configuration

- Go to **cPanel** > **Setup Node.js App**.
- Click **Create Application**.
- **Node.js version**: Select 18 or higher.
- **Application mode**: Production.
- **Application root**: Path to your folder (e.g., `portfolio`).
- **Application URL**: Your domain.
- **Application startup file**: `server.js`.
- Click **Create**.

### 4. Environment Variables

- In the Node.js App settings, scroll to **Environment variables**.
- Add the following:
  - `DB_HOST`: `localhost`
  - `DB_USER`: `your_db_username`
  - `DB_PASS`: `your_db_password`
  - `DB_NAME`: `your_db_name`
  - `NODE_ENV`: `production`

---

## 🔵 Option 2: VPS Server (Ubuntu / Nginx)

Recommended for high performance and full control.

### 1. Initial Setup

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mysql-server nginx
```

### 2. Clone & Install

```bash
git clone https://github.com/mahmudulhassan-dev/myprofile.git
cd myprofile
npm install --legacy-peer-deps
npm run build
```

### 3. Process Management (PM2)

```bash
sudo npm install -g pm2
pm2 start server.js --name "portfolio-app"
pm2 save
pm2 startup
```

### 4. Nginx Reverse Proxy

Create a config file: `/etc/nginx/sites-available/portfolio`

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it and get SSL:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## 🛡️ Security Best Practices

- **Firewall**: Ensure only ports 80, 443, and 22 are open.
- **API Limits**: The system includes built-in rate limiting for sensitive routes.
- **Backups**: Set up a cron job to backup your MySQL database daily.

---

## 🆘 Support

For advanced configuration or custom automation, contact **Amanaflow Support**.
