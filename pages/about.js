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
    // Generates a random slogan from a list of slogans
    setSlogan(slogans[Math.floor(Math.random() * slogans.length)]);
  }, []);
  return (
    <>
      <Head>
        <title>Binary Search - About</title>
      </Head>
      <Navbar signedIn={session} />
      <div className='m-4 flex items-center justify-around flex-wrap p-10 self-center gap-16 mx-auto'>
        <Image
          src='/assets/vectors/undraw1.svg'
          height={500}
          width={500}
          alt='icon1'
          draggable={false}
        />
        <div className='flex flex-col items-center w-[50%]'>
          <h1 className='text-3xl font-bold italic text-center'>{slogan}</h1>
          <p>
            Binary Search is a dating platform for CS/Engineering major
            students. This platform is for people to find other users, chat with
            people of interests, and meet new people.
            <div className='rounded bg-Purple3 p-4 text-white mt-5'>
              <p className='font-bold'>Users</p>
              <p>
                On Binary Search, you can find others who probably also majors
                in CS or STEM, if you have failed to socialize in person. It
                isn&apos;t too late!
              </p>
              <p className='font-bold mt-3'>Project</p>
              <p>
                If you have many side-projects but don&apos;t know where to
                showcase them. You can now posts them on Binary Search. You can
                also look at other people&apos;s project.
              </p>
              <p className='font-bold mt-3'>Chat</p>
              <p>
                {' '}
                Don&apos; be afraid to talk to others. Confidence comes from
                within; from your skills, your side projects, and your passion
                for CS!
              </p>
            </div>
          </p>
          {!session && (
            <button
              className='btn-red mt-5 self-stretch'
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
