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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const RegisterSection = ({ router }) => {
  const [newUserInfo, setNewUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    confirmTos: false,
  });
  const onRegisterClick = async () => {
    if (
      newUserInfo.firstName.length === 0 ||
      newUserInfo.lastName.length === 0
    ) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'First and last name are required!',
      });
    }
    if (newUserInfo.email.length === 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Email is required!',
      });
    }
    if (newUserInfo.password !== newUserInfo.confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
      });
    }

    if (newUserInfo.confirmTos === false) {
      return Swal.fire({
        icon: 'error',
        title: 'One more thing...',
        text: 'You must agree to the Terms of Service!',
      });
    }

    const auth = getAuth();

    createUserWithEmailAndPassword(
      auth,
      newUserInfo.email,
      newUserInfo.password
    )
      .then((userCredential) => {
        // Signed in
        updateProfile(userCredential.user, {
          displayName: `${capitalizeFirstLetter(
            newUserInfo.firstName
          )} ${capitalizeFirstLetter(newUserInfo.lastName)}`,
        }).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Account registered, please complete your profile',
          }).then(() => {
            signIn('credentials', {
              redirect: false,
              email: newUserInfo.email,
              password: newUserInfo.password,
            }).then(({ ok, error }) => {
              if (ok) {
                router.push('/profile');
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Something went wrong, please try again',
                });
              }
            });
          });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
        // ..
      });
  };
  return (
    <>
      <div className='mx-5 flex flex-col mt-5 justify-center items-center'>
        <div className='flex flex-col w-[30%] mb-2 gap-2'>
          <input
            placeholder='First Name'
            type='text'
            className='rounded'
            onChange={(e) =>
              setNewUserInfo({ ...newUserInfo, firstName: e.target.value })
            }
          />
          <input
            placeholder='Last Name'
            type='text'
            className='rounded'
            onChange={(e) =>
              setNewUserInfo({ ...newUserInfo, lastName: e.target.value })
            }
          />
          <input
            placeholder='Email'
            type='email'
            className='rounded'
            onChange={(e) =>
              setNewUserInfo({ ...newUserInfo, email: e.target.value })
            }
          />
          <input
            placeholder='Password'
            type='password'
            className='rounded'
            onChange={(e) =>
              setNewUserInfo({ ...newUserInfo, password: e.target.value })
            }
          />
          <input
            placeholder='Confirm Password'
            type='password'
            className='rounded'
            onChange={(e) =>
              setNewUserInfo({
                ...newUserInfo,
                confirmPassword: e.target.value,
              })
            }
          />
          <div className='flex gap-2 items-center'>
            <input
              id='tos-cb'
              type='checkbox'
              onChange={(e) =>
                setNewUserInfo({ ...newUserInfo, confirmTos: e.target.value })
              }
            />
            <label htmlFor='tos-cb'>
              I agree with the{' '}
              <a
                className='text-blue-400 cursor-pointer'
                onClick={() => router.push('/secret-tos')}
              >
                terms and conditions
              </a>
            </label>
          </div>
          <button
            className='btn-blue3 flex justify-center items-center mt-1 gap-2'
            onClick={onRegisterClick}
          >
            Register{' '}
          </button>{' '}
        </div>
        <button className='flex w-[30%] justify-center items-center gap-2 btn-cyan'>
          <Image
            src='/assets/icon/icons8-google.svg'
            height={20}
            width={20}
            alt='googleIcon'
          />{' '}
          Register with Google
        </button>
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
        <title>Binary Search - Register</title>
      </Head>
      <Navbar signedIn={session} />
      <h1 className='text-center text-3xl mt-4'>Register</h1>
      {session && <AccountSettings session={session.user} />}
      {!session && <RegisterSection router={router} />}
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
