import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
  updateDoc,
  setDoc,
  doc,
} from 'firebase/firestore';

const addToCollection = async (collectionName, doc) => {
  const db = getFirestore();
  const userRef = collection(db, collectionName);
  await addDoc(userRef, doc);
};

const saveToCollection = async (collectionName, newDoc, id) => {
  const db = getFirestore();
  const userRef = collection(db, collectionName);
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, newDoc);
};

const addFieldToCollection = async (collectionName, id, field, value) => {
  const db = getFirestore();
  const userRef = collection(db, collectionName);
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    [field]: value,
  });
};

export { addToCollection, saveToCollection, addFieldToCollection };
