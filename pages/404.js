import Head from 'next/head';
import React, { useState, useEffect } from 'react';

const funnyPhrases = [
  'just like my significant other',
  'just like the bugs in my code',
  "I don't want to look for it",
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function NotFoundPage() {
  const [p, setP] = useState();

  useEffect(() => {
    setP(getRandom(funnyPhrases));
  }, []);
  return (
    <>
      <Head>
        <title>404 Not Found</title>
      </Head>
      <div className='h-screen flex justify-center items-center bg-bsBlue text-white text-3xl'>
        Page not found, {p}
      </div>
    </>
  );
}
