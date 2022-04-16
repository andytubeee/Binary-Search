import {
  faCircleNodes,
  faCommentDots,
  faHeartbeat,
  faShield,
  faShieldCat,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default function UserCard({ user }) {
  console.log(user);
  const { firstName, lastName, bio, skills, gender } = user;
  return (
    <div className='py-4 rounded-lg border-bsBlue border-2 flex flex-col px-4 my-3'>
      <h1>
        {firstName} {lastName} <span className='italic'>({gender[0]})</span>
      </h1>
      <h2 className='italic'>{bio}</h2>
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
      </div>
    </div>
  );
}
