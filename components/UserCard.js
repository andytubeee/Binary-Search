import React from 'react';

export default function UserCard({ firstName, lastName, bio, skills, gender }) {
  return (
    <div className='py-4 rounded-lg border-bsBlue border-2 flex flex-col px-4 m-5'>
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
    </div>
  );
}
