import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import {
  getOtherUsers,
  getUserByEmail,
  getUserDocId,
} from '../utils/backend/getUser';
import { useRouter } from 'next/router';
import UserCard from '../components/UserCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorClosed,
  faDoorOpen,
  faRightFromBracket,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

const HomeMain = ({ session, otherUsers, curUser }) => {
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(otherUsers);
  const [sortBy, setSortBy] = useState('default');
  React.useEffect(() => {
    const sorted = [...filteredUsers];
    if (sortBy === 'name') {
      sorted = sorted.sort((a, b) => {
        return a.firstName > b.firstName ? 1 : -1;
      });
    } else if (sortBy === 'skills') {
      sorted = sorted.sort((a, b) => {
        return a.skills.length > b.skills.length ? -1 : 1;
      });
    } else if (sortBy === 'popularity') {
      sorted = sorted.sort((a, b) => {
        return (a?.interestedUsers || []).length >
          (b?.interestedUsers || []).length
          ? -1
          : 1;
      });
    } else if (sortBy === 'default') {
      sorted = otherUsers;
    }
    setFilteredUsers(sorted);
  }, [sortBy]);

  const onSearchClick = () => {
    if (search) {
      setFilteredUsers(
        filteredUsers.filter((user) => {
          if (
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase()) ||
            user.bio.toLowerCase().includes(search.toLowerCase()) ||
            user.skills
              .map((s) => s.toLowerCase())
              .includes(search.toLowerCase())
          ) {
            return true;
          }
          return false;
        })
      );
    } else {
      setFilteredUsers(otherUsers);
    }
  };
  return (
    <>
      <div className='w-full mx-auto'>
        <h1 className='text-3xl mt-8 text-center my-4 font-bold'>
          Hello{' '}
          {curUser
            ? curUser.firstName + ' ' + curUser.lastName
            : session.user.name}
          !{' '}
        </h1>

        {curUser === null && (
          <h1 className='text-center text-red-600'>
            <span className='font-bold'>Note: </span>
            Please complete your profile...
          </h1>
        )}
        <div className='flex flex-col'>
          <h1 className='font-bold text-xl mb-2'>Browser Users</h1>
          <div className='flex gap-3'>
            <input
              className='flex-1 border rounded pl-2 w-100'
              placeholder='Search'
              onChange={(e) => {
                setSearch(e.target.value);
                if (!e.target.value) {
                  setFilteredUsers(otherUsers);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearchClick();
              }}
            />
            <button onClick={onSearchClick} className='btn-blue min-w-max '>
              Search&nbsp;
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className='mt-2'>
            <p className='font-bold'>Sort by </p>
            <select
              className='rounded-md'
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
            >
              <option value='default'>Default</option>
              <option value='name'>Name</option>
              <option value='skills'>Skills</option>
              <option value='popularity'>Popularity</option>
            </select>
          </div>
          <div className='overflow-scroll content-center flex flex-wrap min-w-[300px] justify-between gap-10 mt-5'>
            {(filteredUsers || []).map((user, i) => (
              <UserCard key={i} user={user} currentUser={curUser} />
            ))}
            {!filteredUsers && <h1>We have no users at the moment... :(</h1>}
            {filteredUsers.length === 0 && search.length > 0 && (
              <h1>No user found with current search keywords</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default function Home({ pageProps }) {
  const { session, user, otherUsers } = pageProps;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Binary Search</title>
      </Head>
      <Navbar signedIn={session} />
      {!session ? (
        <div className='flex flex-col min-h-[600px] mx-auto max-w-[400px] my-5 justify-center'>
          <p className='font-bold mx-5 my-3 text-center'>
            To see other users, please register or log in first.
          </p>
          <button
            className='btn-blue mx-auto font-bold w-[200px] lg:w-[385px]'
            onClick={() => router.push('/register')}
          >
            <FontAwesomeIcon icon={faDoorOpen} className='text-white' />
            &nbsp; Register
          </button>
          <div className='flex gap-3 flex-wrap justify-center content-center my-3'>
            <button
              className='btn-pink min-w-[170px] mr-3 font-bold'
              onClick={() => router.push('/signin')}
            >
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className='text-white'
              />
              &nbsp; Sign In
            </button>
            <button
              className='btn-blue2 font-bold flex items-center gap-3'
              onClick={() => {
                signIn('google');
              }}
            >
              <Image
                src='/assets/icon/icons8-google.svg'
                height={20}
                width={20}
                alt='googleIcon'
              />{' '}
              Login with Google
            </button>
          </div>
        </div>
      ) : (
        <HomeMain session={session} otherUsers={otherUsers} curUser={user} />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userEmail = session?.user?.email;
  const user = userEmail !== undefined ? await getUserByEmail(userEmail) : null;
  const uid = await getUserDocId(userEmail);

  const otherUsersPromises = await getOtherUsers(
    userEmail !== undefined ? userEmail : ''
  );

  const otherUsers = await Promise.all(otherUsersPromises).then(
    (otherUsers) => otherUsers
  );

  // console.log(otherUsers);
  return {
    props: {
      pageProps: {
        session,
        user: uid ? { ...user, id: uid } : null,
        otherUsers,
      },
    },
  };
}
