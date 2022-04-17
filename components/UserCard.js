import {
  faCircleNodes,
  faCode,
  faCommentDots,
  faHeartbeat,
  faShield,
  faShieldCat,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import React from 'react';

export default function UserCard({ user }) {
  const { firstName, lastName, bio, skills, gender } = user;
  const router = useRouter();
  return (
    <div className='py-4 rounded-lg border-bsBlue border-2 flex flex-col px-4 my-5'>
      <h1 className='text-2xl font-bold'>
        {firstName} {lastName} <span className='italic'>({gender[0]})</span>
      </h1>
      <h2 className='italic mb-3'> {bio}</h2>
      <p className='font-bold'>Skills</p>
      <ul>
        {skills.map((skill, i) => (
          <li key={i} className='ml-2'>
            {skill}
          </li>
        ))}
      </ul>
      <div className='flex mt-1'>
        <button className='btn-orange mr-3'>
          <FontAwesomeIcon icon={faCircleNodes} className='' /> Show Interest
        </button>
        <button className='btn-orange mr-2'>
          <FontAwesomeIcon icon={faCommentDots} className='' /> Send Message
        </button>
        <button
          className='btn-cyan mr-2'
          onClick={() => router.push(`/project/${user.id}`)}
        >
          <FontAwesomeIcon icon={faCode} className='' /> See Projects
        </button>
      </div>
    </div>
  );
}
