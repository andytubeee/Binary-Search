import React from 'react';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { getUserByEmail } from '../utils/backend/getUser';
import Navbar from '../components/Navbar';
import { AccountSettings } from '../components/AccountSettings';
import { useRouter } from 'next/router';

const UserProfile = ({ user, router }) => {
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
        <div className='grid grid-cols-5 w-80 p-2'>
          {user.skills.map((skill, i) => (
            <p key={i} className='mx-3'>
              {skill}
            </p>
          ))}
        </div>
        <h1 className='font-bold text-lg my-3'>Explore the App</h1>
        <button
          className='border rounded p-2 bg-blue-300 text-white'
          onClick={() => router.push('/')}
        >
          Find Users
        </button>
      </div>
    </>
  );
};

export default function ProfilePage({ pageProps }) {
  const { session, user } = pageProps;
  const router = useRouter();
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
          <div className='flex'>
            <UserProfile user={user} router={router} />
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

  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  return {
    props: { pageProps: { session, user } },
  };
}
