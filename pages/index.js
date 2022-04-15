import Head from 'next/head';
import Image from 'next/image';

import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import Navbar from '../components/Navbar';

export default function Home({ pageProps }) {
  const { session } = pageProps;
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
          <button
            className='text-xl font-extrabold'
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

  return {
    props: { pageProps: { session } }, // will be passed to the page component as props
  };
}
