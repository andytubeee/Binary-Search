import {
  faPaperPlane,
  faPlane,
  faUserAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { AccountSettings } from '../components/AccountSettings';
import Navbar from '../components/Navbar';
import {
  getActiveChatRooms,
  getOtherUsers,
  getUserByEmail,
  getUserDocId,
} from '../utils/backend/getUser';

const ChatWindow = ({ chat }) => {
  // userId is the other user's id
  if (chat.length === 0)
    return (
      <>
        <div className='min-h-full flex justify-center items-center'>
          <h1 className='text-3xl'>Go find someone to talk to</h1>
        </div>
      </>
    );
  console.log(chat);
  return (
    <div className='h-full relative p-3'>
      <div className='flex min-w-[95%] md:min-w-[98%] gap-3 bottom-2 absolute flex-wrap'>
        <input type='text' className='flex-1 rounded' placeholder='Text' />
        <button className='btn-orange'>
          <FontAwesomeIcon icon={faPaperPlane} /> &nbsp; Send
        </button>
      </div>
    </div>
  );
};
export default function ChatPage({ pageProps }) {
  const { session, user, chats } = pageProps;
  const router = useRouter();
  const { c } = router.query;
  const [activeChatId, setActiveChat] = useState(c);
  const ChatUserColumn = () => {
    return (
      <div className='p-3 flex flex-1 flex-col'>
        <div className='pb-2 border-b-2 flex flex-col'>
          <button className='btn-blue w-100' onClick={() => router.push('/')}>
            <FontAwesomeIcon icon={faUserAlt} /> &nbsp; Find a User
          </button>
        </div>
        <div className='flex flex-col gap-2 mt-2 overflow-scroll'>
          {chats &&
            chats.map((c, i) => (
              <button
                className={`border rounded px-2 ${
                  activeChatId === c.id ? 'bg-blue-500 text-white' : 'bg-white'
                }`}
                key={i}
                onClick={() => {
                  setActiveChat(c.id);
                }}
              >
                {c.name}
              </button>
            ))}
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
        {!user ? (
          <AccountSettings session={session.user} />
        ) : (
          <>
            <h1 className='text-center text-3xl font-bold mt-5'>Chat</h1>

            <div className='flex gap-3 justify-between my-3 px-2'>
              <div className='flex h-[68vh] md:h-[78vh] border rounded flex-[0.2]'>
                <ChatUserColumn />
              </div>
              <div className='flex flex-1 border flex-col rounded'>
                <ChatWindow
                  userId={activeChatId}
                  chat={chats.filter((c) => c.id === activeChatId)}
                />
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
  const id = await getUserDocId(userEmail);
  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  if (!user) {
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    };
  }
  const chatPromise = getActiveChatRooms(id).then(async (resArr) => {
    return await Promise.all(resArr).then((value) => value);
  });
  const chats = await chatPromise.then((chats) => chats);
  return {
    props: { pageProps: { session, user: { ...user, id }, chats } },
  };
}
