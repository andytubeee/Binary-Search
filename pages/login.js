import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

import { getSession, signIn, signOut } from 'next-auth/react';
import Navbar from '../components/Navbar';
export default function login({ pageProps }) {
  const { session } = pageProps;
  return (
    <>
      <Head>
        <title>Binary Search</title>
      </Head>
      <Navbar signedIn={session} />
      <div>Login Page</div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  return {
    props: { pageProps: { session } }, // will be passed to the page component as props
  };
}
