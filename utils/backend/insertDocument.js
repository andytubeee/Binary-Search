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

  originalData = {
    ...originalData,
    projects: [
      ...(originalData.projects || []).map((project) => {
        if (project.id !== projectId) {
          return project;
        }
        return {
          ...project,
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
  await setDoc(docRef, originalData);
};

const removeLikeProject = async (projectId, curUserId) => {
  const userId = projectId.split('-')[0];
  const db = getFirestore();
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  const originalData = docSnap.data();

  originalData = {
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
              .likedBy.filter((user) => user !== curUserId),
          ],
        };
      }),
    ],
  };
  // console.log(originalData);
  await setDoc(docRef, originalData);
};

export {
  addToCollection,
  saveToCollection,
  addFieldToCollection,
  likeProject,
  removeLikeProject,
};
