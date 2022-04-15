import React from 'react';

export default function Error({ errorMsg }) {
  return (
    <>
      <div className='bg-bsBlue h-screen flex items-center justify-center text-white text-center text-3xl font-bold'>
        {errorMsg}
      </div>
    </>
  );
}
