import { getSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

import { getUserByEmail } from '../utils/backend/getUser';
import { addToCollection } from '../utils/backend/modifyDocument';
import { AccountSettings } from '../components/AccountSettings';

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import Image from 'next/image';
import { useRouter } from 'next/router';

const SignInSection = ({ router }) => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });
  const onSignInClick = async () => {
    if (loginInfo.email.length === 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Email is required!',
      });
    }
    if (loginInfo.password.length === 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords is empty!',
      });
    }
    await signIn('credentials', {
      redirect: false,
      email: loginInfo.email,
      password: loginInfo.password,
    })
      .then(({ ok, error }) => {
        if (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong, check your credential!',
          });
        } else {
          console.log('Pressed');
          // router.push('');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className='mx-5 flex flex-col justify-center items-center'>
        <div className='flex flex-col w-[80%] md:w-[40%] lg:w-[30%] mt-5 gap-2'>
          <input
            placeholder='Email'
            type='email'
            className='rounded'
            onChange={(e) =>
              setLoginInfo({ ...loginInfo, email: e.target.value })
            }
          />
          <input
            placeholder='Password'
            type='password'
            className='rounded'
            onChange={(e) =>
              setLoginInfo({ ...loginInfo, password: e.target.value })
            }
          />
          <button
            className='btn-blue3 flex justify-center items-center gap-2'
            onClick={onSignInClick}
          >
            Sign In{' '}
          </button>{' '}
          <button
            className='flex w-[100%] justify-center items-center gap-2 btn-cyan'
            onClick={() => signIn('google')}
          >
            <Image
              src='/assets/icon/icons8-google.svg'
              height={20}
              width={20}
              alt='googleIcon'
            />{' '}
            Sign In with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default function RegisterPage({ pageProps }) {
  const { session } = pageProps;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Binary Search - Sign In</title>
      </Head>
      <Navbar signedIn={session} />
      <h1 className='text-center text-3xl mt-4'>Sign In</h1>
      {session && <AccountSettings session={session.user} />}
      {!session && <SignInSection router={router} />}
    </>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);

  const userEmail = session?.user?.email;
  const user = userEmail !== undefined ? await getUserByEmail(userEmail) : null;
  if (user) {
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    };
  }
  return {
    props: { pageProps: { session } },
  };
}
