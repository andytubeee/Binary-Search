import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Navbar from '../components/Navbar';

export default function AboutPage() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Binary Search - About</title>
      </Head>
      <Navbar />
      <div>
        <h1 className='text-3xl font-bold'>I want to C you ++</h1>
        <p>
          Binary Search is a dating platform for CS/Engineering major students
        </p>
        <button
          className='border rounded p-2 bg-bsBlue text-white'
          onClick={() => router.push('/register')}
        >
          Register Now!
        </button>
        <p className='fixed bottom-3 left-1'>Developed by Andrew Yang</p>
      </div>
    </>
  );
}
