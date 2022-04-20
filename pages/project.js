import React, { useState, useRef } from 'react';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { getUserByEmail, getUserDocId } from '../utils/backend/getUser';
import Navbar from '../components/Navbar';
import { AccountSettings } from '../components/AccountSettings';
import { useRouter } from 'next/router';
import { addFieldToCollection } from '../utils/backend/modifyDocument';
import Swal from 'sweetalert2';

const AddProject = ({ user, router }) => {
  const validURL = (str) => {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(str);
  };
  const TechStack = ({ stack }) => {
    return (
      <div className='flex items-center min-w-max gap-1 border px-2 rounded mr-2'>
        <h1>{stack}</h1>
        <button
          className='bg-red-500 hover:bg-red-400 text-white rounded-full px-2 my-1'
          onClick={() =>
            setPInfo({
              ...pInfo,
              techStacks: pInfo.techStacks.filter((f) => f !== stack),
            })
          }
        >
          x
        </button>
      </div>
    );
  };
  const [pInfo, setPInfo] = useState({
    name: '',
    description: '',
    url: '',
    techStacks: [],
  });
  const stackTextFieldRef = useRef();
  const addStack = () => {
    const stack = stackTextFieldRef.current.value;
    setPInfo({
      ...pInfo,
      techStacks: [...pInfo.techStacks, stack],
    });
    stackTextFieldRef.current.value = '';
  };
  const addProject = async () => {
    if (pInfo.name.length > 0 && pInfo.description.length > 0) {
      const docId = await getUserDocId(user.email);
      const curProjects = user.projects || [];
      const projId = docId.concat('-', curProjects.length);
      await addFieldToCollection('users', docId, 'projects', [
        ...curProjects,
        { ...pInfo, id: projId },
      ])
        .then(() => {
          Swal.fire({
            title: 'Project Added',
            text: 'Project has been added to your profile',
            icon: 'success',
          }).then(() => {
            router.reload(window.location.pathname);
          });
        })
        .catch((err) => {
          Swal.fire({
            title: 'Error',
            text: err.message,
            icon: 'error',
          });
        });
    } else {
      if (pInfo.name.length <= 0 || pInfo.description.length <= 0) {
        Swal.fire({
          title: 'Error',
          text: 'Please fill out all fields',
          icon: 'error',
        });
      } else if (!validURL(pInfo.url)) {
        Swal.fire({
          title: 'Error',
          text: 'Invalid URL',
          icon: 'error',
        });
      }
    }
  };
  return (
    <div className='flex flex-col border-r-4 p-3 gap-3'>
      <h1 className='text-2xl'>New Project</h1>
      <input
        placeholder='Project Name'
        type='text'
        className='rounded'
        onChange={(e) => setPInfo({ ...pInfo, name: e.target.value })}
      />
      <textarea
        placeholder='Project Description'
        className='rounded'
        onChange={(e) => setPInfo({ ...pInfo, description: e.target.value })}
      />
      <input
        placeholder='URL (Optional)'
        type='text'
        className='rounded'
        onChange={(e) => setPInfo({ ...pInfo, url: e.target.value })}
      />
      <div className='flex gap-2'>
        <input
          type='text'
          placeholder='Tech Stack'
          className='rounded'
          ref={stackTextFieldRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addStack();
          }}
        />{' '}
        <button className=' btn-blue' onClick={addStack}>
          Add
        </button>
      </div>
      <div className='flex flex-wrap gap-2 max-w-[340px]'>
        {pInfo.techStacks.map((stack, i) => (
          <TechStack stack={stack} key={i} />
        ))}
      </div>
      <button className='btn-cyan' onClick={addProject}>
        Add Project
      </button>
    </div>
  );
};

const ProjectCard = ({ project, user, router }) => {
  const deleteProject = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.value) {
        const docId = await getUserDocId(user.email);
        const curProjects = user.projects || [];
        await addFieldToCollection(
          'users',
          docId,
          'projects',
          curProjects.filter((f) => f.name !== project.name)
        )
          .then(() => {
            Swal.fire({
              title: 'Project Deleted',
              text: 'Project has been deleted from your profile',
              icon: 'success',
            }).then(() => {
              router.reload(window.location.pathname);
            });
          })
          .catch((err) => {
            Swal.fire({
              title: 'Error',
              text: err.message,
              icon: 'error',
            });
          });
      }
    });
  };
  return (
    <div className='bg-bsBlue min-h-[50%] min-w-[300px] text-white p-3 rounded-xl m-3'>
      <h1 className='text-2xl font-bold'>{project.name}</h1>
      <p className='italic'>{project?.url}</p>
      <p>{project.description}</p>
      <p className='mt-4 font-bold'>Tech Stack(s)</p>
      <div className='flex flex-wrap gap-2'>
        {project.techStacks.map((stack, i) => (
          <p key={i}>{stack}</p>
        ))}
      </div>
      <h1>
        <p className='font-bold mt-3'>Likes: </p>
        {project?.likedBy?.length || 0}
      </h1>
      <button className='btn-red mt-3' onClick={deleteProject}>
        Delete
      </button>
    </div>
  );
};

export default function ProjectPage({ pageProps }) {
  const { session, user } = pageProps;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Binary Search - Profile</title>
      </Head>
      <Navbar signedIn={session} />
      <h1 className='text-center text-3xl font-bold mt-5'>Projects</h1>

      <div className='flex flex-col md:flex-row mx-5 gap-10'>
        <AddProject user={user} router={router} />
        <div className='flex items-start flex-wrap'>
          {user.projects &&
            user.projects.map((project, i) => (
              <ProjectCard
                project={project}
                key={i}
                user={user}
                router={router}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const userEmail = session?.user?.email;
  const user = userEmail !== undefined ? await getUserByEmail(userEmail) : null;

  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  if (!user) {
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    };
  }
  return {
    props: { pageProps: { session, user } },
  };
}
