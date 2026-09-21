#!/usr/bin/env bash

# ==============================================================================
# VNB GROUP - VPS DEPLOYMENT SCRIPT
# Triển khai tự động Landing Page (vnb.io.vn) và ERP (pos.vnb.io.vn)
# ==============================================================================

set -e

echo "🚀 [1/5] Kéo mã nguồn mới nhất từ Git..."
git pull origin main || git pull origin master

echo "📦 [2/5] Build Landing Page (vnb.io.vn)..."
npm install
npm run build

echo "🏪 [3/5] Build ERP Client (pos.vnb.io.vn)..."
cd vnb-erp/client
npm install
npm run build
cd ../..

echo "⚙️ [4/5] Build ERP Server & Cập nhật tiến trình PM2..."
cd vnb-erp/server
npm install
if [ ! -f .env ]; then
  echo "⚠️ Không tìm thấy .env, đang copy từ .env.example..."
  cp .env.example .env
fi
npm run build
cd ../..

# Khởi động hoặc reload PM2
pm2 reload ecosystem.config.cjs || pm2 start ecosystem.config.cjs
pm2 save

echo "🌐 [5/5] Kiểm tra và nạp lại cấu hình Nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo "✅ ========================================================="
echo "🎉 Triển khai thành công!"
echo "👉 Landing Page : http://vnb.io.vn (hoặc https://vnb.io.vn)"
echo "👉 ERP / POS     : http://pos.vnb.io.vn (hoặc https://pos.vnb.io.vn)"
echo "👉 Backend Health: http://pos.vnb.io.vn/api/health"
echo "==========================================================="
