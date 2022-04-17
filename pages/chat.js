import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { AccountSettings } from '../components/AccountSettings';
import Navbar from '../components/Navbar';
import { getOtherUsers, getUserByEmail } from '../utils/backend/getUser';

export default function ChatPage({ pageProps }) {
  const { session, notConfirmed, user } = pageProps;
  const router = useRouter();
  const ChatWindow = ({ userId }) => {
    if (!userId) return null;
  };
  const ChatUserColumn = () => {
    return (
      <div className='p-3 flex flex-col'>
        <div className='pb-2 border-b-2 flex flex-col'>
          <button className='btn-blue w-100' onClick={() => router.push('/')}>
            <FontAwesomeIcon icon={faUserAlt} /> &nbsp; Find a User
          </button>
        </div>
      </div>
    );
  };
  return (
    <>
      <Head>
        <title>Binary Search - Chat</title>
      </Head>
      <div className='overflow-hidden min-h-screen flex flex-col'>
        <Navbar signedIn={session} />
        {notConfirmed ? (
          <AccountSettings session={session.user} />
        ) : (
          <>
            <h1 className='text-center text-3xl font-bold mt-5'>Chat</h1>

            <div className='flex gap-3 justify-between px-4 my-3 flex-1'>
              <div className='flex border flex-col flex-[0.2]'>
                <ChatUserColumn />
              </div>
              <div className='flex flex-1 border flex-col'>
                <ChatWindow />
              </div>
            </div>
          </>
        )}
      </div>
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
