import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import { getOtherUsers, getUserByEmail } from '../utils/backend/getUser';
import { useRouter } from 'next/router';
import UserCard from '../components/UserCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorClosed,
  faDoorOpen,
  faRightFromBracket,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

const HomeMain = ({ session, otherUsers }) => {
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(otherUsers);
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
      <div className='max-h-sc'>
        <h1 className='text-3xl text-center my-4'>
          Hello {session.user.name}!{' '}
        </h1>
        <div className='mx-5 p-2 flex flex-col'>
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
            <button
              onClick={onSearchClick}
              className='btn-pink bg-bsPink1 min-w-max '
            >
              Search&nbsp;
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className='overflow-scroll mt-5'>
            {filteredUsers.map((user, i) => (
              <UserCard key={i} user={user} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default function Home({ pageProps }) {
  const { session, notConfirmed, otherUsers } = pageProps;
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
            className='btn-blue mx-2 font-bold'
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
        <HomeMain session={session} otherUsers={otherUsers} />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userEmail = session?.user?.email;
  const user = userEmail !== undefined ? await getUserByEmail(userEmail) : null;
  const otherUsers = await getOtherUsers(
    userEmail !== undefined ? userEmail : ''
  );
  return {
    props: { pageProps: { session, notConfirmed: !user, otherUsers } },
  };
}
