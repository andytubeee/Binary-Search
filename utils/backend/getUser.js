import {
  collection,
  doc,
  getDoc,
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
  return qs.docs.map((doc) => {
    return { ...Object(doc.data()), id: doc.id };
  });
};

const getUserDocId = async (email) => {
  const db = getFirestore();
  const userRef = collection(db, 'users');
  const q = query(userRef, where('email', '==', email));
  const qs = await getDocs(q);
  return qs.size == 1 ? qs.docs[0].id : null;
};

const getDocField = async (collection, uid, field) => {
  const db = getFirestore();
  const userRef = collection(db, collection);
  const q = query(userRef, where('id', '==', uid));
  const qs = await getDocs(q);
  return qs.size == 1 ? qs.docs[0][field] : null;
};

const getUserByID = async (id) => {
  const db = getFirestore();
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? docSnap.data() : null;
};

export {
  getUserByEmail,
  getOtherUsers,
  getUserDocId,
  getDocField,
  getUserByID,
};
