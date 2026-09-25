# Thiệp cưới Quân & Hường

React 18 + Vite. Ngày cưới: **11:00, 25/10/2026 (Asia/Ho_Chi_Minh)**.

## Chạy dự án

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## Thay nội dung và ảnh

Tất cả thông tin hiển thị nằm trong `src/wedding.js`: gia đình, địa điểm, ngày giờ, lời mời, lời cảm ơn, ảnh và timeline. Khi đổi ngày, cập nhật cả `date` và `startsAt`; giữ múi giờ `+07:00`. Giao diện tự tính lịch và đếm ngược.

Ảnh được lấy từ các thư mục con trong `public/wedding`. Chạy `npm run prepare-wedding-images` để tạo bản WebP rộng tối đa 1600px trong `public/wedding/web`, giữ nguyên ảnh gốc. Banner dùng `ZEN_1975`, chú rể dùng `ZEN_2171`, cô dâu dùng `ZEN_2280`, phần cảm ơn dùng `ZEN_2088`; album gồm 10 ảnh đôi. Thay lựa chọn và thứ tự trong `images`, `groom.image`, `bride.image`, `album` của `src/wedding.js`. Nếu đổi ảnh banner, cập nhật cả preload trong `index.html`. Ba mốc đầu timeline vẫn là nội dung mẫu chưa có ngày.

## Firebase mới

1. Tạo dự án Firebase mới, thêm Web App và tạo Firestore Database. Không dùng hoặc nhập dữ liệu dự án của thiệp cũ.
2. Chép `.env.example` thành `.env.local`, điền các trường `VITE_FIREBASE_*` từ cấu hình Web App. Không đưa service-account/private key vào frontend. Biến `VITE_API_BASE_URL` cũ không còn được sử dụng.
3. Triển khai Rules trong `firestore.rules` bằng Firebase Console hoặc `npx firebase deploy --only firestore:rules --project YOUR_NEW_PROJECT_ID` sau khi đăng nhập tài khoản có quyền. Lệnh này là bước triển khai riêng, chưa được chạy trong lần chỉnh sửa.
4. Khởi động lại Vite, hoặc build lại khi thay biến môi trường. Trên hosting, khai báo cùng các biến khi build.
5. Kiểm tra một lời chúc trên dự án mới: tên, nội dung, avatar, thời gian Việt Nam và tải lại trang. Collection `guest_book` được tạo khi gửi lần đầu.

Thiếu API key, project ID hoặc app ID: website vẫn hiển thị, popup báo chưa kết nối và không cho gửi. Không tự chuyển sang Firebase cũ hoặc lưu thành công giả trên trình duyệt.

Lời chúc là dữ liệu công khai, khách không cần đăng nhập. Rules cho tạo dữ liệu hợp lệ, đọc tối đa 50 mục mỗi truy vấn và cấm sửa/xóa. Dữ liệu gồm `guest_name` (1–80 ký tự), `message` (1–1.000 ký tự), `create_date` (server timestamp), `avatar_color` (bảng màu cố định). Đây không phải cơ chế chống spam; nếu cần chống spam cho website công khai có lưu lượng lớn, bổ sung App Check hoặc endpoint kiểm soát gửi riêng.

## Kiểm thử

```sh
npm run lint
npm test
npm run test:browser
npm run test:rules
npm run test:firebase
```

Browser tests dùng Microsoft Edge headless đã cài trên Windows, tự chạy Vite trên cổng 4173; cần để cổng này trống. Có thể đổi `channel` trong `playwright.config.mjs` cho môi trường khác. Ảnh chụp và trace nằm ở `test-results/` (không commit).

Rules tests chạy Firestore Emulator với project giả `demo-quan-huong`, cổng 8080, cần Java 21+. Không chạm dữ liệu production. Để kiểm tra popup bằng emulator, đặt cấu hình Web App giả trong `.env.local`: API key `demo-key`, project ID `demo-quan-huong`, app ID `demo-app`, `VITE_FIREBASE_EMULATOR_HOST=127.0.0.1` và port `8080`; chạy `npx firebase emulators:start --only firestore --project demo-quan-huong` rồi Vite. Không dùng host emulator khi build production.

Các kiểm tra bao gồm lịch, múi giờ trước/sau sự kiện, validation, Rules, phân trang, viewport 360/390/768/1440px, reveal, chế độ giảm chuyển động, carousel và popup. Chỉ xuất bản sau khi xác nhận ảnh và kết nối Firebase mới.
