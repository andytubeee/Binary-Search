import React from 'react';
import { useSession, getSession } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';

import { FirebaseApp } from 'firebase/app';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  return <>You are logged in</>;
}

export async function getServerSideProps(context) {
  const session = await getSession();
  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  console.log(FirebaseApp);
  return {
    props: { session }, // will be passed to the page component as props
  };
}
