# 🚀 Hướng Dẫn Triển Khai VNB Business OS Lên Máy Chủ VPS

Tài liệu này hướng dẫn chi tiết từng bước để triển khai toàn bộ hệ thống **VNB Business OS** (Backend Node.js API, ERP Client, Landing Page và MongoDB) lên máy chủ VPS Linux (Ubuntu / Debian / CentOS).

---

## 1. Yêu Cầu Máy Chủ VPS

- **Hệ điều hành khuyến nghị**: Ubuntu 22.04 LTS hoặc 24.04 LTS.
- **Cấu hình tối thiểu**: 2 Core CPU, 2GB - 4GB RAM, 20GB+ SSD.
- **Các phần mềm cần cài đặt trên VPS**:
  - `Node.js` (Phiên bản v20.x hoặc v22.x LTS)
  - `npm`
  - `MongoDB` (v6.x hoặc v7.x Community Server)
  - `PM2` (Trình quản lý tiến trình Node.js: `npm install -g pm2`)
  - `Nginx` (Web server & Reverse Proxy)
  - `Certbot` (Cấp chứng chỉ SSL HTTPS miễn phí Let's Encrypt)

---

## 2. Các Bước Cài Đặt Ban Đầu Trên VPS

```bash
# 1. Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# 2. Cài đặt Node.js 20 LTS & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2

# 3. Cài đặt MongoDB
sudo apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod
```

---

## 3. Kéo Code & Cài Đặt Dependencies

```bash
# Clone dự án từ GitHub VNkhangcot
cd /var/www
git clone https://github.com/VNkhangcot/VNBGroup.git
cd VNBGroup

# Cài đặt và build Landing Page (Root)
npm install
npm run build

# Cài đặt và build ERP Client
cd vnb-erp/client
npm install
npm run build
cd ../..

# Cài đặt và build ERP Server
cd vnb-erp/server
npm install
cp .env.example .env
# (Chỉnh sửa .env nếu cần thay đổi cổng hoặc kết nối MongoDB)
npm run build

# Chạy seed dữ liệu ban đầu
npx tsx src/seeds/seedData.ts
npx tsx src/seeds/seedOrders.ts
cd ../..
```

---

## 4. Khởi Chạy Backend Bằng PM2

```bash
# Đang đứng tại thư mục gốc /var/www/VNBGroup
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Kiểm tra trạng thái backend:
```bash
pm2 status
pm2 logs vnb-erp-api
```

---

## 5. Cấu Hình Nginx Reverse Proxy

Tạo file cấu hình Nginx: `sudo nano /etc/nginx/sites-available/vnbgroup`

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com; # Thay bằng tên miền của bạn

    # 1. ERP App Client & POS
    location /app/ {
        alias /var/www/VNBGroup/vnb-erp/client/dist/;
        index index.html;
        try_files $uri $uri/ /app/index.html;
    }

    # 2. Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 3. Landing Page (Root)
    location / {
        root /var/www/VNBGroup/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

Kích hoạt cấu hình Nginx và cài đặt SSL:
```bash
sudo ln -s /etc/nginx/sites-available/vnbgroup /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Cài đặt chứng chỉ SSL tự động
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 6. Tài Khoản Đăng Nhập Quản Trị Mặc Định

| Vai trò | Tên đăng nhập | Mật khẩu mặc định | Mã PIN 1-chạm |
| :--- | :--- | :--- | :--- |
| **Super Admin (Quản Trị Tập Đoàn)** | `superadmin` | `vnb123` | `9999` |
| **Chủ Tiệm (Store Owner)** | `admin` | `vnb123` | `8888` |
| **Thu Ngân Ca Sáng** | `cohoa` | `vnb123` | `1234` |
