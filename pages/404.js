import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Error from '../components/Error';

const funnyPhrases = [
  'just like my significant other',
  'just like the bugs in my code',
  "I don't want to look for it",
  'I encourage you to create it yourself',
  "not on me this time, that's on you",
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
      <Error errorMsg={`Page not found, ${p}.`} />
    </>
  );
}
