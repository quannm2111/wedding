import { GUEST_BOOK_MUTATION } from "./collections/guest_book";

const FIREBASE_APP_MUTATION = {
  GUESTBOOK: { ...GUEST_BOOK_MUTATION },
};

export default FIREBASE_APP_MUTATION;
