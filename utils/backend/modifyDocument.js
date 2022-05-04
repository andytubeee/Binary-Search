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
  getDoc,
} from 'firebase/firestore';

const addToCollection = async (collectionName, doc) => {
  const db = getFirestore();
  const userRef = collection(db, collectionName);
  await addDoc(userRef, doc);
};

const updateProfile = async (userId, newProfile) => {
  const db = getFirestore();
  const docRef = await getDoc(doc(db, 'users', userId));
  const curUserData = docRef.data();
  await setDoc(doc(db, 'users', userId), {
    ...curUserData,
    ...newProfile,
  });
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

const likeProject = async (projectId, curUserId) => {
  const userId = projectId.split('-')[0];
  const db = getFirestore();
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  const originalData = docSnap.data();

  // Create a new data object from original data, and add the current user to the likedBy list
  const newData = {
    ...originalData, // Spread thr original data fields
    // Map through the projects array and add the current user to the likedBy list
    projects: [
      ...(originalData.projects || []).map((project) => {
        if (project.id !== projectId) {
          return project;
        }
        return {
          ...project, // Spread the original project fields
          likedBy: [
            ...(originalData.projects.filter(
              (project) => project.id === projectId
            )[0].likedBy || []),
            curUserId,
          ],
        };
      }),
    ],
  };
  await setDoc(docRef, newData);
};

const removeLikeProject = async (projectId, curUserId) => {
  const userId = projectId.split('-')[0];
  const db = getFirestore();
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  const originalData = docSnap.data();

  const newData = {
    ...originalData,
    projects: [
      ...(originalData.projects || []).map((project) => {
        if (project.id !== projectId) {
          return project;
        }
        return {
          ...project,
          likedBy: [
            ...originalData.projects
              .filter((project) => project.id === projectId)[0]
              .likedBy.filter((user) => user !== curUserId), // Filter out the current user from the likedBy list
          ],
        };
      }),
    ],
  };
  await setDoc(docRef, newData);
};

const generateChatroom = async (uId1, uId2) => {
  // Let uId1 be current user and uId2 be the other user
  const db = getFirestore();
  const chatId = uId1 + '-' + uId2;
  const chatId2 = uId2 + '-' + uId1;
  const docRef1 = await getDoc(doc(db, 'chatRooms', chatId));
  const docRef2 = await getDoc(doc(db, 'chatRooms', chatId2));

  // Prevent generating a chatroom if one already exists (a->b == b->a)
  if (!docRef1.exists() && !docRef2.exists())
    await setDoc(doc(db, 'chatRooms', chatId), {
      messages: [],
    });
};

const sendChatToFirebase = async (chatId, message) => {
  const db = getFirestore();
  const docRef = await getDoc(doc(db, 'chatRooms', chatId));

  const curMsgData = docRef.data();
  await setDoc(doc(db, 'chatRooms', chatId), {
    messages: [...curMsgData.messages, message],
  });
};

// interestedUsers: Other users interested in you
// usersInterested: Users you are interested in
const showInterestToUser = async (
  otherUserId /* The other user */,
  curUserId
) => {
  // curUserId is interested in userId
  const db = getFirestore();
  const curUserDocRef = await getDoc(doc(db, 'users', curUserId));
  const otherUserDocRef = await getDoc(doc(db, 'users', otherUserId));
  const curUserData = curUserDocRef.data();
  const otherUserData = otherUserDocRef.data();
  if (!curUserData.usersInterested.includes(otherUserId)) {
    await setDoc(doc(db, 'users', curUserId), {
      ...curUserData,
      usersInterested: [...(curUserData.usersInterested || []), otherUserId], // add the other user to current user's interested list
    });
    await setDoc(doc(db, 'users', otherUserId), {
      ...otherUserData,
      interestedUsers: [...(otherUserData.interestedUsers || []), curUserId], // add current user to other user's interested list
    });
  }
};

// interestedUsers: Other users interested in you
// usersInterested: Users you are interested in
const removeUserInterest = async (
  otherUserId /* The other user */,
  curUserId
) => {
  // curUserId is interested in userId
  const db = getFirestore();
  const curUserDocRef = await getDoc(doc(db, 'users', curUserId));
  const otherUserDocRef = await getDoc(doc(db, 'users', otherUserId));
  const curUserData = curUserDocRef.data();
  const otherUserData = otherUserDocRef.data();
  // console.log(curUserData, otherUserData);
  // Remove the other user from current user's interested list
  await setDoc(doc(db, 'users', curUserId), {
    ...curUserData,
    usersInterested: curUserData.usersInterested.filter(
      (user) => user !== otherUserId
    ),
  });
  await setDoc(doc(db, 'users', otherUserId), {
    ...otherUserData,
    interestedUsers: otherUserData.interestedUsers.filter(
      (user) => user !== curUserId
    ), // add current user to other user's interested list
  });
};

const deleteMessage = async (chatId, message) => {
  const db = getFirestore();
  const docRef = await getDoc(doc(db, 'chatRooms', chatId));

  const curMsgData = docRef.data();
  // console.log(curMsgData);
  await setDoc(doc(db, 'chatRooms', chatId), {
    messages: curMsgData.messages.filter(
      (msg) => JSON.stringify(msg) !== JSON.stringify(message)
    ),
  });
};

export {
  addToCollection,
  saveToCollection,
  addFieldToCollection,
  updateProfile,
  likeProject,
  removeLikeProject,
  generateChatroom,
  sendChatToFirebase,
  showInterestToUser,
  removeUserInterest,
  deleteMessage,
};
