export const AVATAR_COLORS = ['#e8a0b5', '#f0b7c4', '#d4849c', '#f3c6d0', '#c98aa0'];
export const WISH_SUGGESTIONS = [
  'Chúc Quân và Hường trăm năm hạnh phúc, mãi yêu thương và đồng hành cùng nhau!',
  'Chúc hai bạn một đời bình an, một nhà đầy ắp tiếng cười và yêu thương.',
  'Mừng ngày chung đôi! Chúc cô dâu chú rể luôn hạnh phúc như hôm nay.',
  'Chúc tổ ấm nhỏ của hai bạn luôn ngập tràn niềm vui và những điều ngọt ngào.',
  'Chúc hai bạn cùng nhau viết tiếp một câu chuyện tình yêu thật đẹp. Hạnh phúc nhé!',
];
export function validateWish(name, message) {
  const guest_name = name.trim();
  const text = message.trim();
  if (!guest_name || Array.from(guest_name).length > 80) throw new Error('Tên cần từ 1 đến 80 ký tự.');
  if (!text || Array.from(text).length > 1000) throw new Error('Lời chúc cần từ 1 đến 1.000 ký tự.');
  return { guest_name, message: text };
}
