import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import { getOtherUsers, getUserByEmail } from '../utils/backend/getUser';
import { useRouter } from 'next/router';
import UserCard from '../components/UserCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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
            />
            <button
              onClick={onSearchClick}
              className='rounded bg-bsPink1 text-white p-2 hover:bg-bsBeige1 transition-all'
            >
              Search&nbsp;
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className='overflow-scroll mt-5'>
            {filteredUsers.map((user, i) => (
              <UserCard
                key={i}
                firstName={user.firstName}
                lastName={user.lastName}
                skills={user.skills}
                bio={user.bio}
                gender={user.gender}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default function Home({ pageProps }) {
  const { session, notConfirmed, otherUsers } = pageProps;
  console.log(session);
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Binary Search</title>
      </Head>
      <Navbar signedIn={session} />
      {!session ? (
        <div className='flex flex-col items-center mt-5 justify-center'>
          <p className='font-bold mx-5 text-center'>
            To see other users, please register or log in first.
          </p>

          <button
            className='text-xl font-bold text-white bg-blue-700 hover:bg-blue-500 py-2 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center items-center gap-4 m-4'
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
