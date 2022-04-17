import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getSession } from 'next-auth/react';
import { getUserByEmail } from '../utils/backend/getUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function AboutPage({ pageProps }) {
  const router = useRouter();
  const { session } = pageProps;
  const slogans = [
    'I want to C you ++',
    'Skill is the new beauty',
    'Touching grass has never been easier',
    'It isn’t tough to talk to people',
    'It is time to talk in person, not through pull requests',
  ];
  const [slogan, setSlogan] = useState('');
  useEffect(() => {
    setSlogan(slogans[Math.floor(Math.random() * slogans.length)]);
  }, []);
  return (
    <>
      <Head>
        <title>Binary Search - About</title>
      </Head>
      <Navbar signedIn={session} />
      <div className='m-4 flex items-center justify-around flex-wrap p-10 self-center mx-auto'>
        <Image
          src='/assets/vectors/undraw1.svg'
          height={500}
          width={500}
          alt='icon1'
          draggable={false}
        />
        <div>
          <h1 className='text-3xl font-bold italic text-center'>{slogan}</h1>
          <p>
            Binary Search is a dating platform for CS/Engineering major students
          </p>
          {!session && (
            <button
              className='border rounded p-2 my-5 bg-bsBlue hover:bg-cyan-700 text-white'
              onClick={() => router.push('/register')}
            >
              <FontAwesomeIcon icon={faUserGroup} className='text-white' />
              &nbsp; Register Now!
            </button>
          )}
        </div>
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
