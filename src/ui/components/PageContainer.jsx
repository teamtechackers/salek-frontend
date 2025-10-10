// PageContainer.js
import React from "react";

const PageContainer = ({
  topSection,
  tableSection,
  totalSection,
  paginationSection,
  userDetails,
}) => {
  return (
    <div className="h-screen flex w-full justify-center mt-2">
      <div className="w-[97%] h-full flex flex-col">
        {!userDetails && (
          <>
            <div className="h-[10%]">{topSection}</div>
            <div className="h-[5%]">{totalSection}</div>
          </>
        )}

        <div
          className={`${
            userDetails ? "h-[82%]" : "h-[60%]"
          } w-full overflow-y-auto mt-2`}
        >
          {tableSection}
        </div>
{!userDetails && (
        <div className="h-[5%] w-full flex items-center justify-end pr-4 mt-8">
          {paginationSection}
        </div>
)}
      </div>
    </div>
  );
};

export default PageContainer;
