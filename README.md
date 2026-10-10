# Stayora

Ứng dụng đặt phòng Đà Lạt xây dựng bằng React và Vite.

## Chạy ứng dụng

```sh
npm install
npm run dev
```

Mở `/admin` để vào khu vực quản trị. Thông tin đăng nhập quản trị được cấu hình bằng `VITE_ADMIN_EMAIL` và `VITE_ADMIN_PASSWORD` trong `.env.local`.

## Dữ liệu demo và đồng bộ

Ở lần chạy đầu, ứng dụng thêm 100 hồ sơ khách demo, 16 tài khoản chủ nhà gắn riêng với 16 chỗ nghỉ, 100 đơn đặt phòng mẫu và 60 đánh giá mẫu vào `localStorage`. Hồ sơ demo dùng địa chỉ `example.test` và không phải tài khoản người dùng thật. Danh mục 16 chỗ nghỉ là nguồn dữ liệu chung cho trang chủ, tìm kiếm và quản trị; đánh giá mới cập nhật điểm và số lượt đánh giá của chỗ nghỉ. Đơn đặt phòng và trạng thái của đơn được dùng chung cho lịch sử khách, trang quản trị và báo cáo doanh thu.

Dữ liệu hiện được lưu trong trình duyệt và đồng bộ giữa các trang/tab của cùng trình duyệt. Đây là dữ liệu demo phía client, chưa phải cơ sở dữ liệu dùng chung giữa thiết bị hay hệ thống xác thực phù hợp để triển khai production.
