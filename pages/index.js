import Head from 'next/head';
import Image from 'next/image';

import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import { getOtherUsers, getUserByEmail } from '../utils/backend/getUser';
import { useRouter } from 'next/router';
import UserCard from '../components/UserCard';

export default function Home({ pageProps }) {
  const { session, notConfirmed, otherUsers } = pageProps;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Binary Search</title>
      </Head>
      <Navbar signedIn={session} />
      {!session ? (
        <div className='flex flex-col items-center mt-5 justify-center'>
          <p className='font-bold'>
            To see other users, please register or log in first.
          </p>

          <button
            className='text-xl font-bold text-white bg-blue-700 hover:bg-blue-500 py-2 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center items-center gap-4 m-4'
            onClick={() => {
              signIn('google');
            }}
          >
            <Image
              src='/assets/icon/icons8-google.svg'
              height={20}
              width={20}
              alt='googleIcon'
            />{' '}
            Login with Google
          </button>
        </div>
      ) : (
        <>
          <h1 className='text-3xl text-center mt-4'>
            Hello {session?.user.name}!
          </h1>

          {notConfirmed && (
            <div className='flex justify-center flex-col items-center mt-5'>
              <p>
                <span className='font-extrabold'>Note: </span>Your account is
                not confirmed, get your information in!
              </p>
              <button
                className='border px-2 rounded my-3 text-white bg-gray-400 hover:bg-slate-100 hover:text-black'
                onClick={() => router.push('/register')}
              >
                Confirm your information
              </button>
            </div>
          )}
          <h1 className='font-bold ml-10'>Browser Users</h1>
          {otherUsers.map((user, i) => (
            <UserCard
              key={i}
              firstName={user.firstName}
              lastName={user.lastName}
              skills={user.skills}
              bio={user.bio}
              gender={user.gender}
            />
          ))}
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
