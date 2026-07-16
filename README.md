# Website xác nhận đặt phòng

Ứng dụng React được build bằng Vite và deploy trên Vercel.

## Yêu cầu

- Node.js 22.12 trở lên (nhánh 22.x)
- npm 10

## Phát triển local

```bash
npm ci
npm run dev
```

Vite sẽ hiển thị địa chỉ local, mặc định là `http://localhost:5173`.

## Build production

```bash
npm run build
npm run preview
```

Artifact production nằm trong thư mục `dist`.

## Quản lý dữ liệu khách sạn

Ứng dụng chính tại `/` sử dụng `MultipleConfirm`. Dữ liệu mặc định nằm trong
[`src/data/hotels.json`](src/data/hotels.json), sau đó được ghi đè bằng dữ liệu
trong `localStorage` của trình duyệt.

Form `MultipleConfirm` hỗ trợ hai mẫu xác nhận: `Classic` và `Contemporary`.
Mẫu có thể được chọn ngay khi nhập booking và vẫn được giữ khi quay lại chỉnh sửa.

Mở `/admin/hotels` để:

- thêm, sửa và xóa khách sạn;
- export dữ liệu thành `hotels-backup.json`;
- import lại file JSON trên máy khác;
- khôi phục dữ liệu mặc định.

Các màn hình xác nhận cũ vẫn được giữ dưới `/legacy/...`. Dữ liệu localStorage
chỉ dùng chung trong cùng một trình duyệt/profile, không tự đồng bộ giữa các
thiết bị.

## Deploy Vercel

`vercel.json` đã cấu hình:

- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite về `index.html` để các route của React Router hoạt động khi tải lại trang

Repo chỉ dùng `package-lock.json`; không thêm lại `yarn.lock` để Vercel luôn cài dependency bằng npm.
