import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

import { getUserByEmail } from '../utils/backend/getUser';
import { addToCollection } from '../utils/backend/insertDocument';
import { InfoRegister } from '../components/InfoRegister';

const RegisterSection = () => {
  return (
    <>
      <div>
        <button>Register with Google</button>
      </div>
    </>
  );
};

export default function RegisterPage({ pageProps }) {
  const { session } = pageProps;
  return (
    <>
      <Head>
        <title>Binary Search - Register</title>
      </Head>
      <Navbar signedIn={session} />
      <h1 className='text-center text-3xl mt-4'>Register</h1>
      {session && <InfoRegister session={session.user} />}
      {!session && <RegisterSection />}
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
