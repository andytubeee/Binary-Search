import React from 'react';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import {
  getUserByEmail,
  getUserByID,
  getUserDocId,
} from '../utils/backend/getUser';
import Navbar from '../components/Navbar';
import { AccountSettings } from '../components/AccountSettings';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faComment,
  faCommentDots,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import {
  generateChatroom,
  removeUserInterest,
} from '../utils/backend/modifyDocument';

const UserProfile = ({ user, router, usersInterested, interestedUsers }) => {
  const InterestedUser = ({ name, id }) => {
    const removeUser = async () => {
      await removeUserInterest(id, user.id).then(() => {
        Swal.fire({
          title: 'Removed!',
          text: `${name} has been removed from your interests`,
          icon: 'success',
        }).then(() => {
          router.reload();
        });
      });
    };

    return (
      <div>
        <div className='flex gap-2 items-center border rounded px-3 justify-center content-start min-w-max'>
          <p>{name}</p>
          <button
            className='bg-red-500 hover:bg-red-400 text-white rounded-full px-2 my-1'
            onClick={removeUser}
          >
            x
          </button>
        </div>
      </div>
    );
  };
  const OtherUser = ({ user: oUser }) => {
    const sendChat = async () => {
      await generateChatroom(oUser.id, user.id).then(() => {
        router.push(`/chat?c=${oUser.id}`);
      });
    };
    return (
      <div className='flex items-center gap-2 mx-auto border-2 rounded-md px-2'>
        <p>{oUser.name}</p>
        <button
          className='bg-cyan-500 hover:bg-cyan-400 text-white rounded-full px-2 my-1'
          onClick={sendChat}
        >
          <FontAwesomeIcon icon={faComment} />
        </button>
      </div>
    );
  };
  return (
    <>
      <div className='flex flex-1 flex-col items-center mt-5'>
        <h1 className='text-xl'>
          <span className='font-bold'>Name: </span>
          {user.firstName} {user.lastName}
        </h1>
        <h1 className='text-xl'>
          <span className='font-bold'>Email: </span>
          {user.email}
        </h1>
        <h1 className='font-bold text-lg mt-2'>Bio</h1>
        <p>{user?.bio || 'You have no bio'}</p>

        <h1 className='font-bold text-lg mt-2'>Skills</h1>
        <div className='flex flex-wrap w-80 p-2'>
          {user.skills.map((skill, i) => (
            <p key={i} className='mx-3'>
              {skill}
            </p>
          ))}
        </div>
        <h1 className='font-bold text-lg my-3'>Explore the App</h1>
        <div className='flex flex-wrap gap-4'>
          <button className='btn-blue' onClick={() => router.push('/')}>
            <FontAwesomeIcon icon={faUser} /> &nbsp; Find Users
          </button>
          <button className='btn-blue' onClick={() => router.push('/chat')}>
            <FontAwesomeIcon icon={faCommentDots} /> &nbsp; Chat
          </button>
          <button className='btn-blue' onClick={() => router.push('/project')}>
            <FontAwesomeIcon icon={faCode} /> &nbsp; Projects
          </button>
        </div>
        <div className='flex gap-10 m-10'>
          <div>
            <h1 className='font-bold text-lg text-center'>
              Users Interested in You
            </h1>
            <div className='text-center flex flex-col py-2 max-h-[200px] gap-1 overflow-y-scroll'>
              {interestedUsers &&
                interestedUsers.map((user, i) => (
                  <OtherUser user={user} key={i} />
                ))}
            </div>
          </div>
          <div>
            <h1 className='font-bold text-lg text-center'>
              Users You are Interested In
            </h1>
            <div className='text-center flex flex-col py-2 gap-1 overflow-y-scroll max-h-[200px]'>
              {usersInterested &&
                usersInterested.map((user, i) => (
                  <InterestedUser name={user.name} id={user.id} key={user.id} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function ProfilePage({ pageProps }) {
  const { session, user, usersInterested, otherUsersInterestedInCurrentUser } =
    pageProps;
  const router = useRouter();
  const { info } = router.query;
  React.useEffect(() => {
    if (info === 'warn') {
      Swal.fire({
        icon: 'warning',
        text: 'You must complete your profile first',
      });
    }
  }, []);
  return (
    <>
      <Head>
        <title>Binary Search - Profile</title>
      </Head>
      <Navbar signedIn={session} />
      <h1 className='text-center text-3xl font-bold mt-5'>Profile</h1>
      {!user ? (
        <AccountSettings session={session.user} />
      ) : (
        <>
          <div className='flex flex-col md:flex-row'>
            <UserProfile
              user={user}
              router={router}
              usersInterested={usersInterested}
              interestedUsers={otherUsersInterestedInCurrentUser}
            />
            <div className='flex-1'>
              <AccountSettings session={session.user} firebaseUser={user} />
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
  const userId = await getUserDocId(userEmail);
  const usersInterested = await Promise.all(
    (user?.usersInterested || []).map(async (userId) => {
      return await getUserByID(userId).then((res) => {
        return { name: res.firstName + ' ' + res.lastName, id: userId };
      });
    })
  );
  const otherUsersInterestedInCurrentUser = await Promise.all(
    (user?.interestedUsers || []).map(async (userId) => {
      return await getUserByID(userId).then((res) => {
        return { name: res.firstName + ' ' + res.lastName, id: userId };
      });
    })
  );
  // await Promise.all(usersInterestedPromise);
  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };

  return {
    props: {
      pageProps: {
        session,
        user: { ...user, id: userId },
        usersInterested,
        otherUsersInterestedInCurrentUser,
      },
    },
  };
}
