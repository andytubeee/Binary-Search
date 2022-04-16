import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';

const getUserByEmail = async (email) => {
  const db = getFirestore();
  const userRef = collection(db, 'users');
  const q = query(userRef, where('email', '==', email));
  const qs = await getDocs(q);
  return qs.size == 1 ? qs.docs[0].data() : null;
};

const getOtherUsers = async (email) => {
  const db = getFirestore();
  const userRef = collection(db, 'users');
  const q = query(userRef, where('email', '!=', email));
  const qs = await getDocs(q);
  return qs.docs.map((doc) => doc.data());
};

const getUserDocId = async (email) => {
  const db = getFirestore();
  const userRef = collection(db, 'users');
  const q = query(userRef, where('email', '==', email));
  const qs = await getDocs(q);
  return qs.size == 1 ? qs.docs[0].id : null;
};
export { getUserByEmail, getOtherUsers, getUserDocId };
