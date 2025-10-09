import React from 'react';

const PageContainer = ({ children }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
