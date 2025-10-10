import React from 'react';

const TotalSection = ({ label, count }) => {
  return (
   <div className='flex w-full items-center justify-between my-2'>
            <h2 className='text-lg font-semibold text-gray-700'>
              {label}
            </h2>
            <span className='text-sm text-gray-500'>{count}</span>
          </div>
  );
};

export default TotalSection;
