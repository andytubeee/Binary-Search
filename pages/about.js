import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Navbar from '../components/Navbar';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '../utils/backend/getUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';

export default function AboutPage({ pageProps }) {
  const router = useRouter();
  const { session } = pageProps;
  return (
    <>
      <Head>
        <title>Binary Search - About</title>
      </Head>
      <Navbar signedIn={session} />
      <div className='m-4'>
        <h1 className='text-3xl font-bold'>I want to C you ++</h1>
        <p>
          Binary Search is a dating platform for CS/Engineering major students
        </p>
        {!session && (
          <button
            className='border rounded p-2 bg-bsBlue hover:bg-cyan-700 text-white'
            onClick={() => router.push('/register')}
          >
            <FontAwesomeIcon icon={faUserGroup} className='text-white' />
            &nbsp; Register Now!
          </button>
        )}
        <p className='fixed bottom-3 left-5'>Developed by Andrew Yang</p>
      </div>
    </>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userEmail = session?.user?.email;
  const user = userEmail !== undefined ? await getUserByEmail(userEmail) : null;

  return {
    props: { pageProps: { session, user } }, // will be passed to the page component as props
  };
}
