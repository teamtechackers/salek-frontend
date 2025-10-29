import React from 'react';

const TotalSection = ({ label, count }) => {
  return (
   <div className='flex w-full items-center justify-between my-2'>
            <h2 className='text-lg font-semibold text-black'>
              {label}
            </h2>
            <span className='text-[20px] font-semibold text-black'>{count}</span>
          </div>
  );
};

export default TotalSection;
