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

## 5. Cấu Hình Tên Miền & Nginx Reverse Proxy

### 5.1. Cấu hình DNS (Tại nhà cung cấp tên miền của bạn)
Trỏ các bản ghi DNS sau về địa chỉ IP của VPS:

| Loại (Type) | Tên bản ghi (Host / Name) | Giá trị (Value / Points to) | Mục đích |
| :--- | :--- | :--- | :--- |
| **A** | `@` (hoặc `vnb.io.vn`) | `<IP_VPS_CỦA_BẠN>` | Landing page chính |
| **A** hoặc **CNAME** | `www` | `<IP_VPS_CỦA_BẠN>` (hoặc `vnb.io.vn`) | Phụ cho Landing page |
| **A** hoặc **CNAME** | `pos` | `<IP_VPS_CỦA_BẠN>` (hoặc `vnb.io.vn`) | Ứng dụng ERP / POS & API |

---

### 5.2. Cấu hình Nginx

File cấu hình mẫu đã có sẵn tại `nginx/vnbgroup.conf`. Bạn có thể copy trực tiếp vào Nginx:

```bash
# Copy cấu hình vào Nginx sites-available
sudo cp /var/www/VNBGroup/nginx/vnbgroup.conf /etc/nginx/sites-available/vnbgroup

# Hoặc tạo mới bằng nano: sudo nano /etc/nginx/sites-available/vnbgroup
```

Nội dung cấu hình chi tiết:

```nginx
# ==============================================================================
# 1. LANDING PAGE: vnb.io.vn & www.vnb.io.vn
# ==============================================================================
server {
    listen 80;
    listen [::]:80;
    server_name vnb.io.vn www.vnb.io.vn;

    root /var/www/VNBGroup/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Static Assets Caching (1 year)
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg|webp|avif)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SPA Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# ==============================================================================
# 2. ERP / POS APPLICATION & BACKEND API: pos.vnb.io.vn
# ==============================================================================
server {
    listen 80;
    listen [::]:80;
    server_name pos.vnb.io.vn;

    root /var/www/VNBGroup/vnb-erp/client/dist;
    index index.html;

    # Dung lượng tối đa khi tải lên hình ảnh sản phẩm/hóa đơn
    client_max_body_size 25M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Backend API Reverse Proxy (Express.js port 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;

        # WebSocket & HTTP Upgrade
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Forwarded Client Info
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Buffering
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # Static Assets Caching (1 year)
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg|webp|avif)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SPA Routing Fallback for ERP Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

### 5.3. Kích Hoạt Nginx & Cấp Chứng Chỉ SSL (HTTPS)

```bash
# Tạo liên kết kích hoạt cấu hình
sudo ln -sf /etc/nginx/sites-available/vnbgroup /etc/nginx/sites-enabled/

# Kiểm tra cú pháp cấu hình Nginx
sudo nginx -t

# Nạp lại Nginx
sudo systemctl reload nginx

# Cài đặt và cấp chứng chỉ SSL miễn phí Let's Encrypt cho cả 3 domain
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d vnb.io.vn -d www.vnb.io.vn -d pos.vnb.io.vn
```
*(Certbot sẽ tự động gia hạn SSL và tự động cập nhật cấu hình Nginx sang HTTPS port 443).*

---

### 5.4. Tự Động Cập Nhật Triển Khai (One-Click Deploy)

Mỗi lần cập nhật code mới, bạn chỉ cần đứng tại thư mục `/var/www/VNBGroup` và chạy:
```bash
bash scripts/deploy.sh
```

---

## 6. Tài Khoản Đăng Nhập Quản Trị Mặc Định

| Vai trò | Tên đăng nhập | Mật khẩu mặc định | Mã PIN 1-chạm |
| :--- | :--- | :--- | :--- |
| **Super Admin (Quản Trị Tập Đoàn)** | `superadmin` | `vnb123` | `9999` |
| **Chủ Tiệm (Store Owner)** | `admin` | `vnb123` | `8888` |
| **Thu Ngân Ca Sáng** | `cohoa` | `vnb123` | `1234` |
