import { GUEST_BOOK_QUERY } from "./collections/guest_book";

const FIREBASE_APP_QUERY = {
  GUESTBOOK: { ...GUEST_BOOK_QUERY },
};

export default FIREBASE_APP_QUERY;
