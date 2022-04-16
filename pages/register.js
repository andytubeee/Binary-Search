import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

import { getUserByEmail } from '../utils/backend/getUser';

const InfoRegister = ({ session: user }) => {
  const firstName = user.name.split(' ')[0];
  const lastName = user.name.split(' ').slice(1).join(' ');
  const [userInfo, setUserInfo] = useState({ firstName, lastName });

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);
  return (
    <>
      <div className='flex flex-col items-center mt-4 py-2'>
        <h1>Complete your Profile</h1>
        <div className='flex flex-col w-7/12 gap-3'>
          <input
            className='border rounded p-2 bg-blue-400 text-white'
            placeholder='First Name'
            defaultValue={firstName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, firstName: e.target.value })
            }
          />
          <input
            className='border rounded p-2 bg-blue-400 text-white'
            placeholder='Last Name'
            defaultValue={lastName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, lastName: e.target.value })
            }
          />
          <textarea
            className='rounded'
            placeholder='Add a bio about yourself'
            height={400}
            onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
          />
          <div>
            <p>I identify as...</p>
            <div className='flex flex-col'>
              <span>
                <input
                  type='radio'
                  id='male'
                  value={'Male'}
                  name='gender'
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, gender: e.target.value })
                  }
                />
                &nbsp;
                <label htmlFor='male'>Male</label>
              </span>
              <span>
                <input
                  type='radio'
                  id='female'
                  value={'Female'}
                  name='gender'
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, gender: e.target.value })
                  }
                />
                &nbsp;
                <label htmlFor='female'>Female</label>
              </span>
              <span>
                <input
                  type='radio'
                  id='other'
                  value={'Other'}
                  name='gender'
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, gender: e.target.value })
                  }
                />
                &nbsp;
                <label htmlFor='other'>Other</label>
              </span>
            </div>
          </div>
          <button className='rounded bg-pink-400 text-white px-4 py-2 hover:bg-bsPink2'>
            Save
          </button>
        </div>
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
    </>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);

  const userEmail = session.user.email;
  const user = await getUserByEmail(userEmail);
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
