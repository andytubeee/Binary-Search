import React from 'react';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { getUserByEmail } from '../utils/backend/getUser';
import Navbar from '../components/Navbar';
import { InfoRegister } from '../components/InfoRegister';

export default function ProfilePage({ pageProps }) {
  const { session, notConfirmed } = pageProps;
  return (
    <>
      <Head>
        <title>Binary Search - Profile</title>
      </Head>
      <Navbar signedIn={session} />
      <h1 className='text-center text-3xl font-bold mt-5'>Profile</h1>
      {notConfirmed ? <InfoRegister session={session.user} /> : null};
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userEmail = session?.user?.email;
  const user = userEmail !== undefined ? await getUserByEmail(userEmail) : null;

  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  return {
    props: { pageProps: { session, notConfirmed: !user } },
  };
}
