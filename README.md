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

## Album ghép ảnh và phong bao

Album dùng một ảnh lớn hiển thị đầy đủ và dải ảnh thu nhỏ cuộn ngang. Danh sách ảnh nằm trong `wedding.album` tại `src/wedding.js`. Ảnh tự chuyển sau 4,5 giây bằng hiệu ứng mờ dần 1,2 giây; tạm dừng khi hover, focus, chuyển tab hoặc ra khỏi màn hình. Chọn ảnh, vuốt, dùng phím trái/phải hoặc mở zoom sẽ dừng tự chuyển. Bấm ảnh chính để xem lớn. Chế độ giảm chuyển động tắt tự chuyển và hiệu ứng.

Màn chào gồm hai cánh cửa hồng pastel phủ toàn màn hình, tự bắt đầu mở sau 0,9 giây và trượt sang hai bên trong khoảng 2,1 giây. Có thể chạm chữ Hỉ để mở sớm. Nút “Đóng thiệp” cho phép xem lại hiệu ứng mà vẫn giữ nội dung form lời chúc. Hiệu ứng reveal kéo dài 1,3 giây; chế độ giảm chuyển động bỏ qua các chuyển động trang trí.

Popup lời chúc có chiều cao cố định theo viewport, phần nội dung cuộn bên trong và dành sẵn chỗ cho thông báo. Gửi thành công sẽ xóa cả tên lẫn nội dung; gửi lỗi giữ nguyên cả hai trường.

## Khi Firebase báo Missing or insufficient permissions

Ứng dụng dùng Cloud Firestore, database `(default)`, collection `guest_book`, khách không đăng nhập. Cấu hình API key không tự cấp quyền đọc/ghi.

1. Mở Firebase Console đúng project ID trong biến môi trường có hiệu lực (`.env.local` có thể ghi đè `.env`). Với cấu hình hiện tại: `wedding-2a934`.
2. Vào Firestore Database → `(default)` → Rules, chép **toàn bộ** `firestore.rules` của dự án rồi Publish. Không dùng Rules của Realtime Database hay chỉ mở quyền cho người đã đăng nhập.
3. Nếu đã Publish đúng mà vẫn bị từ chối, kiểm tra App Check có bật enforcement cho Firestore không; frontend hiện chưa tích hợp App Check. Cần cấu hình provider/token phù hợp nếu muốn bật enforcement.
4. Khởi động lại Vite nếu đổi cấu hình. Thử gửi lại nội dung đang được giữ trong popup.

Rules trong workspace không tự đồng bộ lên Firebase. Kiểm thử emulator xác nhận mã và Rules cục bộ; không xác nhận Rules đang chạy trên dự án thật.

Lỗi đã phát hiện: bảng màu avatar pastel trong `src/guestbook.js` không khớp danh sách màu được phép trong Rules cũ. Rules hiện đã cho phép bảng màu mới và giữ tương thích màu cũ. Cần Publish lại `firestore.rules` đã cập nhật. Truy vấn chỉ đọc trên dự án thật cũng trả `PERMISSION_DENIED`; chưa có tài khoản CLI để kiểm tra Rules thực tế đang triển khai.
