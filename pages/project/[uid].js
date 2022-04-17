import React, { useState, useRef } from 'react';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import {
  getUserByEmail,
  getUserByID,
  getUserDocId,
} from '../../utils/backend/getUser';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';
import {
  addFieldToCollection,
  likeProject,
  removeLikeProject,
} from '../../utils/backend/insertDocument';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const ProjectCard = ({ project, user, router }) => {
  const likeProjectClick = () => {
    // console.log(user);
    if (!alreadyLiked) {
      likeProject(project.id, user.id).then(() => {
        router.reload(window.location.pathname);
      });
    } else {
      removeLikeProject(project.id, user.id).then(() => {
        router.reload(window.location.pathname);
      });
    }
  };
  const alreadyLiked = project?.likedBy?.includes(user.id);
  return (
    <div className='bg-bsBlue min-h-[50%] min-w-[300px] text-white p-3 rounded-xl m-3'>
      <h1 className='text-2xl font-bold'>{project.name}</h1>
      <p className='italic'>{project?.url}</p>
      <p>{project.description}</p>
      <p className='mt-4 font-bold'>Tech Stack(s)</p>
      <div className='flex flex-wrap'>
        {project.techStacks.map((stack, i) => (
          <p key={i}>{stack}</p>
        ))}
      </div>
      <h1>
        <p className='font-bold mt-3'>Likes: </p>
        {project?.likedBy?.length || 0}
      </h1>
      <button className='btn-red mt-3' onClick={likeProjectClick}>
        <FontAwesomeIcon icon={alreadyLiked ? faThumbsDown : faThumbsUp} />{' '}
        &nbsp; {alreadyLiked ? 'Remove Like' : 'Like'}
      </button>
    </div>
  );
};

export default function ProjectPage({ pageProps }) {
  const { session, curUser, projects } = pageProps;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Binary Search - Profile</title>
      </Head>
      <Navbar signedIn={session} />
      <h1 className='text-center text-3xl font-bold mt-5'>Projects</h1>
      {/* {uid} */}
      {!curUser && (
        <p className='mx-4 text-center'>
          You must be signed in to view this page
        </p>
      )}
      {curUser && (
        <div className='flex items-start justify-center flex-wrap'>
          {projects.length > 0 ? (
            projects.map((project, i) => (
              <ProjectCard
                project={project}
                router={router}
                user={curUser}
                key={i}
              />
            ))
          ) : (
            <h1 className='text-center mx-5 my-5'>
              This user has no projects at the moment, check back later
            </h1>
          )}
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userEmail = session.user.email;
  const curUser =
    userEmail !== undefined ? await getUserByEmail(userEmail) : null;
  const theOtherUser = await getUserByID(context.query.uid);
  const curId = await getUserDocId(userEmail);
  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

  return {
    props: {
      pageProps: {
        session,
        curUser: { ...curUser, id: curId },
        projects: theOtherUser?.projects || [],
      },
    },
  };
}
