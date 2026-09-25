import { addDoc, collection, query } from "firebase/firestore";
import { db } from "../firebaseConfig";

const guestBookRef = collection(db, "guest_book");

export const GUEST_BOOK_QUERY = {
  getAllGuestComment: query(guestBookRef),
};

export const GUEST_BOOK_MUTATION = {
  addGuestComment: (newData) => {
    return addDoc(guestBookRef, newData);
  },
};
