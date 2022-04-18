import {
  faPaperPlane,
  faPlane,
  faUserAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { AccountSettings } from '../components/AccountSettings';
import Navbar from '../components/Navbar';
import {
  checkIfChatroomIDExists,
  getActiveChatRooms,
  getOtherUsers,
  getUserByEmail,
  getUserDocId,
} from '../utils/backend/getUser';
import { sendChatToFirebase } from '../utils/backend/modifyDocument';

const ChatWindow = ({ chat, curUser }) => {
  // userId is the other user's id
  const [disableSendBtn, setDisableSendBtn] = useState(true);
  const [chatSnapshot, setChatSnapshot] = useState({});
  if (chat) {
    const db = getFirestore();
    // console.log(chat.chatId);
    onSnapshot(doc(db, 'chatRooms', chat.chatId), (doc) => {
      setChatSnapshot(doc.data());
    });
  }
  if (!chat)
    return (
      <>
        <div className='min-h-full flex justify-center items-center'>
          <h1 className='text-3xl'>Go find someone to talk to</h1>
        </div>
      </>
    );
  const sendChat = () => {
    if (chatInput.current.value) {
      const chatObj = {
        userId: curUser.id,
        message: chatInput.current.value,
        timestamp: Date.now(),
        name: curUser.firstName + ' ' + curUser.lastName,
      };
      chatInput.current.value = '';
      sendChatToFirebase(chat.chatId, chatObj);
      // console.log(chat.id);
    }
  };
  const deleteMessage = async () => {};
  const chatInput = React.createRef();
  const Message = ({ message }) => {
    return (
      <div
        className={`my-2 ${
          message.userId === curUser.id
            ? 'self-end bg-bsBlue '
            : 'self-start bg-gray-400'
        }  text-white rounded px-3 py-1 min-w-[130px] max-w-[50%]`}
      >
        {message.userId === curUser.id && (
          <button className='float-right' onClick={deleteMessage}>
            x
          </button>
        )}
        <p className='text-xs'>{message.name}</p>
        <p>{message.message}</p>
      </div>
    );
  };
  return (
    <div className='h-full relative p-3'>
      <div className='flex min-w-[95%] md:min-w-[98%] gap-3 bottom-2 absolute flex-wrap'>
        <input
          ref={chatInput}
          type='text'
          className='flex-1 rounded'
          placeholder='Text'
          onChange={(e) => setDisableSendBtn(!e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendChat();
            }
          }}
          multiple={true}
        />
        <button
          className={disableSendBtn ? 'btn-disabled' : 'btn-orange'}
          onClick={sendChat}
        >
          <FontAwesomeIcon icon={faPaperPlane} /> &nbsp; Send
        </button>
      </div>
      <div className='flex-1 overflow-y-scroll no-scrollbar flex flex-col max-h-[81%] sm:max-h-[90%] lg:max-h-[90%]'>
        {chatSnapshot.messages &&
          chatSnapshot.messages.map((msg, i) => (
            <Message message={msg} key={i} />
          ))}
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
          <button className='btn-pink2 w-100' onClick={() => router.push('/')}>
            <FontAwesomeIcon icon={faUserAlt} /> &nbsp; Find a User
          </button>
        </div>
        <div className='flex flex-col gap-2 mt-2 overflow-scroll'>
          {chats &&
            chats.map((c, i) => (
              <button
                className={`border rounded px-2 ${
                  activeChatId === c.oUid
                    ? 'bg-blue-500 text-white'
                    : 'bg-white'
                }`}
                key={i}
                onClick={() => {
                  setActiveChat(c.oUid);
                  router.push(`/chat?c=${c.oUid}`);
                }}
              >
                {c.oName}
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
              <div className='flex h-[68vh] md:h-[79vh] border rounded flex-[0.5] lg:flex-[0.3]'>
                <ChatUserColumn />
              </div>
              <div className='flex flex-1 border flex-col h-[68vh] md:h-[79vh] rounded'>
                <ChatWindow
                  chat={
                    chats && chats.filter((c) => c.oUid === activeChatId)[0]
                  }
                  curUser={user}
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
        destination: '/profile?info=warn',
        permanent: false,
      },
    };
  }
  const chatPromise = getActiveChatRooms(id).then(async (resArr) => {
    return await Promise.all(resArr).then((value) => value);
  });
  let chats = await chatPromise.then((chats) => chats);
  chats = chats.filter((c) => c !== undefined);
  return {
    props: { pageProps: { session, user: { ...user, id }, chats } },
  };
}
