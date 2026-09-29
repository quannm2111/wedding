export function guestBookError(error, action = 'send') {
  const prefix = action === 'load' ? 'Chưa tải được lời chúc.' : 'Chưa gửi được lời chúc. Nội dung vẫn được giữ.';
  if (error?.code === 'permission-denied') return `${prefix} Firebase từ chối quyền truy cập. Chủ thiệp cần kiểm tra và Publish Firestore Rules cho guest_book trên đúng dự án.`;
  if (error?.code === 'unavailable') return `${prefix} Kết nối đang gián đoạn, bạn hãy thử lại.`;
  return `${prefix} Bạn hãy thử lại sau.`;
}
