export const wedding = {
  date: '2026-10-25',
  startsAt: '2026-10-25T11:00:00+07:00',
  timeZone: 'Asia/Ho_Chi_Minh',
  venue: 'Trung tâm tiệc cưới A15',
  address: 'Số 55 Trần Hòa, Định Công, Hà Nội',
  vuQuy: {
    startsAt: '2026-10-24T10:00:00+07:00',
    address: 'Thôn Phú Xuân, xã Thọ Phú, Thanh Hóa',
  },
  groom: { role: 'Chú rể', name: 'Nguyễn Mạnh Quân', shortName: 'Mạnh Quân', father: 'Nguyễn Mạnh Tiến', mother: 'Nguyễn Thị Tuyết', image: '/wedding/web/ZEN_2171.webp' },
  bride: { role: 'Cô dâu', name: 'Trần Mai Hường', shortName: 'Mai Hường', father: 'Trần Văn Sơn', mother: 'Mai Thị Gấm', image: '/wedding/web/ZEN_2280.webp' },
  images: { desktop: '/wedding/web/ZEN_1975.webp', mobile: '/wedding/web/ZEN_1975.webp', thanks: '/wedding/web/ZEN_2088.webp' },
  invitation: 'Trân trọng kính mời quý gia đình, người thân và bạn bè đến chung vui trong lễ thành hôn của chúng mình. Sự hiện diện và những lời chúc yêu thương của quý vị là niềm hạnh phúc lớn lao đối với hai gia đình.',
  thanks: 'Cảm ơn bạn đã dành tình cảm và những lời chúc tốt đẹp cho chúng mình. Hẹn gặp bạn trong ngày vui, để cùng lưu giữ những khoảnh khắc thật đáng nhớ.',
  album: ['ZEN_1975', 'ZEN_2088', 'ZEN_2310', 'ZEN_2331', 'ZEN_2353', 'ZEN_2614', 'ZEN_2508', 'ZEN_2748', 'ZEN_1777', 'ZEN_2917'].map(name => `/wedding/web/${name}.webp`),
  timeline: [
    {
      title: 'Tình cờ gặp nhau',
      text: 'Ủa, sao lại gặp đúng người này nhỉ?\nMột cuộc gặp tình cờ, một chút duyên số… và thế là hai nhân vật chính của chúng ta xuất hiện!',
    },
    {
      title: 'Lỡ thích nhau rồi!',
      text: 'Ban đầu là “bạn”, sau thành “người thương”.\nChẳng biết từ lúc nào, những cuộc trò chuyện dài hơn, những lần gặp nhau nhiều hơn và trái tim thì… không chịu nghe lời nữa rồi! 😝',
    },
    {
      title: 'Yêu nhau thôi!',
      text: 'Có nhau rồi thì chuyện gì cũng thành chuyện vui.\nCùng ăn, cùng chơi, cùng cười, cùng dỗi… và quan trọng nhất là dỗi xong vẫn phải yêu nhau tiếp! 🤭',
    },
    {
      title: 'Về chung một nhà',
      text: '25.10.2026 – YES, I DO!\nTừ hôm nay, chính thức có thêm một người để yêu thương, sẻ chia và… chọc nhau cả đời!\nMạnh Quân ❤️ Mai Hường\nThe beginning of forever.',
      weddingDay: true,
    },
  ],
};
export const dateLabel = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: wedding.timeZone }).format(new Date(wedding.startsAt));
export const timeLabel = new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: wedding.timeZone }).format(new Date(wedding.startsAt));
export const weekdayLabel = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', timeZone: wedding.timeZone }).format(new Date(wedding.startsAt));
export function getCountdown(now = Date.now()) {
  const diff = Math.max(0, new Date(wedding.startsAt).getTime() - now);
  const localDay = new Intl.DateTimeFormat('en-CA', { timeZone: wedding.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(now));
  return { days: Math.floor(diff / 86400000), hours: Math.floor(diff / 3600000) % 24, minutes: Math.floor(diff / 60000) % 60, seconds: Math.floor(diff / 1000) % 60, done: diff === 0, isWeddingDay: localDay === wedding.date };
}
export function calendarDays(date = wedding.date) {
  const [year, month, day] = date.split('-').map(Number);
  const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { year, month, day, cells: [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)] };
}
