import React from 'react';

export default function Error({ errorMsg }) {
  return (
    <>
      <div className='bg-Cyan3 h-screen flex items-center justify-center text-white text-center text-3xl font-bold'>
        {errorMsg}
      </div>
    </>
  );
}
