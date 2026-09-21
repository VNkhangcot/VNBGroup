#!/usr/bin/env bash

# ==============================================================================
# VNB GROUP - TOÀN BỘ QUÁ TRÌNH SETUP & TRIỂN KHAI TỪ ĐẦU TRÊN VPS LINUX
# Tên miền:
#   - Landing Page: vnb.io.vn & www.vnb.io.vn
#   - ERP / POS & API: pos.vnb.io.vn
# ==============================================================================

set -e

echo "🚀 [1/8] Cập nhật hệ điều hành..."
sudo apt update && sudo apt upgrade -y

echo "📦 [2/8] Cài đặt Node.js 20 LTS, Nginx, Git, PM2 & Certbot..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git certbot python3-certbot-nginx
sudo npm install -g pm2

echo "🍃 [3/8] Cài đặt và cấu hình MongoDB..."
if ! command -v mongod &> /dev/null; then
  sudo apt install -y gnupg curl
  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor --yes
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
  sudo apt update
  sudo apt install -y mongodb-org || echo "MongoDB install fallback/continue..."
  sudo systemctl enable mongod || true
  sudo systemctl start mongod || true
fi

PROJECT_DIR="/var/www/VNBGroup"
echo "📂 [4/8] Chuẩn bị thư mục dự án tại $PROJECT_DIR..."
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www

if [ ! -d "$PROJECT_DIR/.git" ]; then
  if [ -d "$PROJECT_DIR" ] && [ "$(ls -A $PROJECT_DIR)" ]; then
    echo "Thư mục $PROJECT_DIR đã có sẵn file."
  else
    echo "Cloning mã nguồn từ GitHub..."
    git clone https://github.com/VNkhangcot/VNBGroup.git $PROJECT_DIR
  fi
fi

cd $PROJECT_DIR

echo "🔨 [5/8] Cài đặt và Build Landing Page (vnb.io.vn)..."
npm install
npm run build

echo "🏪 [6/8] Cài đặt và Build ERP Client (pos.vnb.io.vn)..."
cd vnb-erp/client
npm install
npm run build
cd ../..

echo "⚙️ [7/8] Cài đặt & Build ERP Backend Server..."
cd vnb-erp/server
npm install
if [ ! -f .env ]; then
  cp .env.example .env
fi
npm run build

# Khởi chạy seed dữ liệu ban đầu nếu database trống
if command -v mongod &> /dev/null; then
  echo "Chạy seed dữ liệu hệ thống..."
  npx tsx src/seeds/seedData.ts || true
  npx tsx src/seeds/seedOrders.ts || true
fi
cd ../..

# Khởi động Backend bằng PM2
pm2 reload ecosystem.config.cjs || pm2 start ecosystem.config.cjs
pm2 save
pm2 startup || true

echo "🌐 [8/8] Thiết lập cấu hình Nginx..."
sudo cp $PROJECT_DIR/nginx/vnbgroup.conf /etc/nginx/sites-available/vnbgroup
sudo ln -sf /etc/nginx/sites-available/vnbgroup /etc/nginx/sites-enabled/vnbgroup

# Loại bỏ trang mặc định của Nginx nếu có
[ -f /etc/nginx/sites-enabled/default ] && sudo rm /etc/nginx/sites-enabled/default

# Kiểm tra cú pháp Nginx
sudo nginx -t
sudo systemctl reload nginx

echo "🔒 Đang thiết lập chứng chỉ SSL HTTPS qua Certbot..."
sudo certbot --nginx -d vnb.io.vn -d www.vnb.io.vn -d pos.vnb.io.vn --non-interactive --agree-tos --register-unsafely-without-email || {
  echo "⚠️ Lưu ý: Nếu Certbot chưa lấy được chứng chỉ, hãy kiểm tra DNS tên miền đã trỏ đúng về IP máy chủ này chưa."
}

echo "✅ =================================================================="
echo "🎉 CHÚC MỪNG BẠN! HỆ THỐNG ĐÃ HOÀN TẤT TRIỂN KHAI:"
echo "👉 Landing Page : https://vnb.io.vn (và https://www.vnb.io.vn)"
echo "👉 ERP / POS    : https://pos.vnb.io.vn"
echo "👉 API Endpoint : https://pos.vnb.io.vn/api/health"
echo "=================================================================="
