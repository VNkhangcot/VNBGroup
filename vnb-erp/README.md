# VNB Business OS // Hệ Thống Quản Trị Bán Lẻ & Doanh Nghiệp Đa Quy Mô

> Hệ thống quản trị doanh nghiệp linh hoạt theo triết lý **Progressive Modular Complexity** — từ cô bán tạp hóa (giao diện 1 chạm, sổ ghi nợ, VietQR) đến doanh nghiệp vừa và nhỏ (quản lý kho, CRM, phân quyền).
> Ngôn ngữ thiết kế: **Liquid Glass & Obsidian Dark** (phong cách nhận diện thương hiệu VNBGroup).

---

## 💎 Điểm Nổi Bật

1. **Siêu Dễ Dùng Cho Người Không Chuyên (Cô Bán Tạp Hóa)**:
   - Màn hình POS phím số to, bảng danh mục bằng màu sắc & hình ảnh, phím tắt nhanh (`F1 - F6`).
   - Quét mã vạch tự động bằng Camera điện thoại/laptop hoặc máy quét barcode USB.
   - Bảng tính tiền khách đưa & tự tính tiền thối lại chính xác từng nghìn đồng.
   - Sinh mã **VietQR động** tức thì theo từng đơn hàng: khách quét là tự điền đúng số tiền và nội dung chuyển khoản.
   - **Sổ Ghi Nợ Thông Minh**: Ghi nợ 1-chạm khi bán hàng, theo dõi lịch sử và trả nợ từng phần đơn giản như sổ tay.

2. **Khả Năng Chuyển Đổi Quy Mô (Bật / Tắt Module Linh Hoạt)**:
   - **Chế độ Tạp Hóa (Lite)**: Thu gọn tối đa, chỉ giữ POS Bán Hàng, Hàng Hóa, Sổ Ghi Nợ và Báo Cáo Tiền Mặt Hôm Nay.
   - **Chế độ Bán Lẻ Chuẩn (Standard)**: Kích hoạt thêm Nhập Hàng, Kiểm Kê Tồn Kho, Cảnh Báo Hết Hạn Dùng.
   - **Chế độ Doanh Nghiệp SME (Pro)**: Mở khóa CRM Tích Điểm, Phân Quyền Nhân Sự, và Đa Chi Nhánh.

3. **Tech Stack Chuẩn Doanh Nghiệp**:
   - **Backend**: Node.js + Express (TypeScript), kiến trúc Modular Monolith.
   - **Database**: MongoDB (Mongoose ODM) kết hợp In-Memory resilient fallback (chạy mượt mà ngay cả khi chưa bật MongoDB local).
   - **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Zustand + Lucide Icons.

---

## 🚀 Hướng Dẫn Khởi Động Dự Án

### 1. Khởi động Backend API (Port 5000)
```bash
cd vnb-erp/server
npm install
npm run dev
```
Backend API sẽ hoạt động tại `http://localhost:5000`.

### 2. Khởi động Frontend Web App (Port 5174)
```bash
cd vnb-erp/client
npm install
npm run dev
```
Truy cập ứng dụng tại `http://localhost:5174`.
