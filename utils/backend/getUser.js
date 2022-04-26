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

  return qs.docs.map(async (doc) => {
    const dummyImgUrl = await fetch('https://loremflickr.com/300/300/computer')
      .then((resp) => resp.url)
      .then((url) => url);
    return { ...Object(doc.data()), id: doc.id, dummyImgUrl };
  });
};

const getUserDocId = async (email) => {
  if (!email) return null;
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

const getActiveChatRooms = async (userId) => {
  const db = getFirestore();
  const chatRef = await collection(db, 'chatRooms');
  const qSnapshot = await getDocs(chatRef);
  return qSnapshot.docs.map(async (doc) => {
    const uid1 = doc.id.split('-')[0];
    const uid2 = doc.id.split('-')[1];
    const oUid = uid1 === userId ? uid2 : uid1; // Other user's id in this chatroom;
    const oUser = await getUserByID(oUid);
    const oName = oUser.firstName + ' ' + oUser.lastName;
    if (uid1 === userId || uid2 === userId) {
      return { chatId: doc.id, oUid, oName };
    }
  });
};

const checkIfChatroomIDExists = async (chatroomId) => {
  const db = getFirestore();
  return await getDoc(doc(db, 'chatRooms', chatroomId)).then((docSnap) => {
    return docSnap.exists();
  });
};

export {
  getUserByEmail,
  getOtherUsers,
  getUserDocId,
  getDocField,
  getUserByID,
  getActiveChatRooms,
  checkIfChatroomIDExists,
};
