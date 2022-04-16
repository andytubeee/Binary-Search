import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
} from 'firebase/firestore';

const addToCollection = async (collectionName, doc) => {
  const db = getFirestore();
  const userRef = collection(db, collectionName);
  addDoc(userRef, doc);
};

const saveToCollection = async (collectionName, doc) => {
  const db = getFirestore();
  const userRef = collection(db, collectionName);
  addDoc(userRef, doc);
};
export { addToCollection, saveToCollection };
