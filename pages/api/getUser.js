import { collection, getDocs, getFirestore } from 'firebase/firestore';

export default async function handler(req, res) {
  let found = [];

  const getUser = async (email) => {
    const db = getFirestore();
    const userRef = collection(db, 'users');
    getDocs(userRef).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().email === email) {
          found.push(doc.data());
        }
      });
    });
  };
  getUser(req.body.email)
    .then(() => console.log(found))
    .then(() => {
      res.status(200).json({ user: null });
    });
  //   //   res.end(JSON.stringify({ user: getUserByEmail(req.body.email) }));
}
