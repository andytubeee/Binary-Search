import Head from 'next/head';
import Image from 'next/image';

import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import { getUserByEmail } from '../utils/backend/getUser';
import { useRouter } from 'next/router';

export default function Home({ pageProps }) {
  const { session, notConfirmed } = pageProps;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Binary Search</title>
      </Head>
      <Navbar signedIn={session} />
      {!session ? (
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
      ) : (
        <>
          <h1>Hello {session?.user.name}</h1>

          {notConfirmed && (
            <div>
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
          <button
            className='text-xl font-extrabold text-white rounded p-2 bg-purple-700 hover:bg-purple-800'
            onClick={() => {
              signOut();
            }}
          >
            Sign Out
          </button>
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userEmail = session.user.email;
  const user = await getUserByEmail(userEmail);
  return {
    props: { pageProps: { session, notConfirmed: !user } }, // will be passed to the page component as props
  };
}
