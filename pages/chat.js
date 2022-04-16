import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';
import Navbar from '../components/Navbar';
import { getOtherUsers, getUserByEmail } from '../utils/backend/getUser';

export default function ChatPage({ pageProps }) {
  const { session, notConfirmed, user } = pageProps;
  return (
    <>
      <Head>
        <title>Binary Search - Chat</title>
      </Head>
      <Navbar signedIn={session} />
    </>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userEmail = session?.user?.email;
  const user = userEmail !== undefined ? await getUserByEmail(userEmail) : null;
  const otherUsers = await getOtherUsers(
    userEmail !== undefined ? userEmail : ''
  );
  return {
    props: { pageProps: { session, notConfirmed: !user, otherUsers } },
  };
}
