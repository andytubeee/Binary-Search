import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { getUserDocId } from '../utils/backend/getUser';
import {
  addToCollection,
  saveToCollection,
} from '../utils/backend/modifyDocument';

export const AccountSettings = ({ session: user, firebaseUser: fb = null }) => {
  const firstName = user.name.split(' ')[0];
  const lastName = user.name.split(' ').slice(1).join(' ');
  const [userInfo, setUserInfo] = useState({
    firstName: fb ? fb.firstName : firstName,
    lastName: fb ? fb.lastName : lastName,
    email: user.email,
    skills: fb ? fb.skills : [],
    gender: fb ? fb.gender : '',
    bio: fb ? fb.bio : '',
  });

  const skillInputRef = useRef();
  const router = useRouter();
  const SkillBar = ({ label }) => (
    <>
      <div className='flex gap-2 items-center border rounded px-3 justify-center content-start min-w-max'>
        <p>{label}</p>
        <button
          className='bg-red-500 hover:bg-red-400 text-white rounded-full px-2 my-1'
          onClick={() =>
            setUserInfo({
              ...userInfo,
              skills: userInfo.skills.filter((skill) => skill !== label),
            })
          }
        >
          x
        </button>
      </div>
    </>
  );
  const handleSubmit = async (e) => {
    if (!fb) {
      await addToCollection('users', userInfo);
    } else {
      const docId = await getUserDocId(userInfo.email);
      await saveToCollection('users', userInfo, docId);
    }
  };
  const validate = () => {
    if (userInfo.firstName.length < 1) {
      Swal.fire({
        title: 'First name is required',
        icon: 'error',
      });
      return false;
    }
    if (userInfo.lastName.length < 1) {
      Swal.fire({
        title: 'Last name is required',
        icon: 'error',
      });
      return false;
    }
    if (userInfo.gender === '') {
      Swal.fire({
        title: 'Gender is required',
        icon: 'error',
      });
      return false;
    }
    try {
      handleSubmit().then(() => {
        Swal.fire({
          title: 'Saved',
          text: !fb
            ? 'You are now successfully verified'
            : 'Your information has been updated',
          icon: 'success',
        }).then(() => {
          router.push('/');
        });
      });
      //
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err,
        icon: 'error',
      });
    }
  };
  const saveStack = (newSkill) => {
    setUserInfo({
      ...userInfo,
      skills: [...userInfo.skills, newSkill],
    });
    skillInputRef.current.value = '';
  };
  return (
    <>
      <div className='flex flex-col items-center my-4 py-2'>
        <h1 className='font-lg font-bold mb-3'>
          {fb ? 'Account Settings' : 'Complete your Profile'}
        </h1>
        <div className='flex flex-col w-7/12 gap-3'>
          <input
            className='border rounded p-2 bg-blue-400 text-white'
            placeholder='First Name'
            defaultValue={userInfo.firstName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, firstName: e.target.value })
            }
          />
          <input
            className='border rounded p-2 bg-blue-400 text-white'
            placeholder='Last Name'
            defaultValue={userInfo.lastName}
            onChange={(e) =>
              setUserInfo({ ...userInfo, lastName: e.target.value })
            }
          />
          <textarea
            className='rounded'
            placeholder='Add a bio about yourself'
            defaultValue={userInfo.bio}
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
                  checked={userInfo.gender === 'Male'}
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
                  checked={userInfo.gender === 'Female'}
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
                  checked={userInfo.gender === 'Other'}
                />
                &nbsp;
                <label htmlFor='other'>Other</label>
              </span>
            </div>
          </div>
          <div>
            <p>Skills</p>
            <input
              placeholder='Enter your Skill'
              ref={skillInputRef}
              className='rounded pl-2 mr-2 border-blue-400 border-2'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveStack(skillInputRef.current.value);
                }
              }}
            />
            <button
              className=' bg-bsBlue text-white rounded-md px-2 hover:translate-x-1 duration-500 transition-all my-2 lg:m-0'
              onClick={() => {
                const newSkill = skillInputRef.current.value;
                if (userInfo.skills.includes(newSkill)) {
                  return Swal.fire('Oops!', 'Skill already exists', 'error');
                } else if (newSkill === '') {
                  return Swal.fire('Oops!', "Skill can't be empty", 'error');
                }
                saveStack(newSkill);
              }}
            >
              Add Skill
            </button>
            <div className='flex flex-wrap gap-2 mt-3'>
              {userInfo?.skills.map((skill, i) => (
                <SkillBar key={i} label={skill} />
              ))}
            </div>
          </div>
          <button className='btn-pink' onClick={validate}>
            Save
          </button>
        </div>
      </div>
    </>
  );
};
