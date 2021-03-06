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
import { useCollection } from 'react-firebase-hooks/firestore';
import { getFirestore, collection } from 'firebase/firestore';
import {
  generateChatroom,
  showInterestToUser,
} from '../utils/backend/modifyDocument';
import Swal from 'sweetalert2';
import Image from 'next/image';

export default function UserCard({ user, currentUser }) {
  const { firstName, lastName, bio, skills, gender, id, dummyImgUrl } = user; // The user card, not signed in user
  const router = useRouter();

  const onSendMessageBtnClick = async () => {
    await generateChatroom(currentUser.id, id).then((chatroom) => {
      router.push(`/chat?c=${id}`);
    });
  };
  const onShowInterestClick = async () => {
    if (currentUser.id === null) {
      return Swal.fire({
        icon: 'warning',
        text: 'You must complete your profile first',
        showConfirmButton: true,
        confirmButtonText: 'Take me there',
      }).then(async (result) => {
        if (result.value) {
          router.push('/profile');
        }
      });
    }
    showInterestToUser(id, currentUser.id).then(() => {
      Swal.fire({
        title: 'Interest Sent!',
        icon: 'success',
        text: 'Done :)',
      });
    });
  };
  return (
    <div className='flex flex-wrap flex-row border-2 py-4 px-4 rounded-lg justify-between w-[100%] md:w-[40%] lg:w-[45%] items-center'>
      <div className='flex items-center flex-wrap justify-between w-full'>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-bold'>
            {firstName} {lastName} <span className='italic'>({gender[0]})</span>
          </h1>
          <h2 className='italic mb-3'> {bio}</h2>
          <div className='flex gap-10'>
            <div>
              <p className='font-bold'>Skills</p>
              <ul>
                {skills.map((skill, i) => (
                  <li key={i} className='ml-2'>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className='font-bold'>Popularity</span>:{' '}
              {user?.interestedUsers?.length || 0}
            </div>
          </div>
        </div>
        {dummyImgUrl && (
          <Image
            src={dummyImgUrl}
            alt={'Project Image'}
            width={150}
            height={150}
            className='rounded-lg justify-self-end'
            draggable={false}
          />
        )}
      </div>
      <div className='flex flex-wrap content-center justify-between w-full mt-1'>
        <div className='flex'>
          <button className='btn-orange mr-3' onClick={onShowInterestClick}>
            <FontAwesomeIcon icon={faCircleNodes} className='' /> Show Interest
          </button>
          <button className='btn-orange mr-2' onClick={onSendMessageBtnClick}>
            <FontAwesomeIcon icon={faCommentDots} className='' /> Send Message
          </button>
        </div>
        <button
          className='btn-pink justify-self-end w-[150px]'
          onClick={() => router.push(`/project/${id}`)}
        >
          <FontAwesomeIcon icon={faCode} className='' /> See Projects
        </button>
      </div>
    </div>
  );
}
