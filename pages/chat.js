import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';
import { AccountSettings } from '../components/AccountSettings';
import Navbar from '../components/Navbar';
import { getOtherUsers, getUserByEmail } from '../utils/backend/getUser';

export default function ChatPage({ pageProps }) {
  const { session, notConfirmed, user } = pageProps;
  const ChatWindow = (userId) => {};
  return (
    <>
      <Head>
        <title>Binary Search - Chat</title>
      </Head>
      <Navbar signedIn={session} />
      {notConfirmed ? (
        <AccountSettings session={session.user} />
      ) : (
        <>
          <h1 className='text-center text-3xl font-bold mt-5'>Chat</h1>

          <div className='flex gap-3 justify-between px-4 border'>
            <div className='flex border flex-col'></div>
            <div className='flex flex-1 border flex-col'>
              <ChatWindow />
            </div>
          </div>
        </>
      )}
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
