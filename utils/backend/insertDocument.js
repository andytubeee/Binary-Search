import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
} from 'firebase/firestore';

export const addToCollection = async (collectionName, doc) => {
  const db = getFirestore();
  const userRef = collection(db, collectionName);
  addDoc(userRef, doc);
};
