import React from 'react';
import { useSession, getSession, signIn } from 'next-auth/react';
import { faHeart, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Navbar({ signedIn }) {
  const router = useRouter();

  const MenuItem = ({ label, direct = '' }) => (
    <button
      className='text-white hover:text-bsPink2'
      onClick={() => router.push(`/${direct}`)}
    >
      {label}
    </button>
  );

  return (
    <>
      <nav className='bg-bsBlue flex justify-between py-5 px-2'>
        <div className='flex gap-5'>
          <a className='flex gap-2 items-center text-white'>
            <FontAwesomeIcon icon={faHeart} className='text-bsPink1 text-3xl' />
            <span
              className='text-2xl cursor-pointer'
              onClick={() => router.push('/')}
            >
              Binary Search
            </span>
          </a>
          <div className='flex gap-2' id='mobile-menu'>
            <MenuItem label='Home' />
            <MenuItem label='About' direct='about' />
          </div>
        </div>

        <div>
          {!signedIn ? (
            <button
              className='text-white rounded p-2  bg-bsPink1 hover:bg-bsPink2'
              onClick={() => signIn('google')}
            >
              Sign In
            </button>
          ) : (
            <button
              className='text-white rounded p-2 bg-purple-700 hover:bg-purple-800 font-bold'
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
