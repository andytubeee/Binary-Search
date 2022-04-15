import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';
import Navbar from '../components/Navbar';
import { collection, getFirestore } from 'firebase/firestore';
const InfoRegister = () => (
  <>
    <h1>Complete your Profile</h1>
    <input placeholder='First Name' />
    <input placeholder='Last Name' />
    <button>Save</button>
  </>
);

export default function RegisterPage({ pageProps }) {
  const { session } = pageProps;
  return (
    <>
      <Head>
        <title>Binary Search - Register</title>
      </Head>
      <Navbar signedIn={session} />
    </>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userEmail = session.user.email;
  const db = getFirestore();
  const userRef = collection(db, 'users');
  return {
    props: { pageProps: { session } }, // will be passed to the page component as props
  };
}
