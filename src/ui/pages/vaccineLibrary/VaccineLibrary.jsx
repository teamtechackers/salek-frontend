import React from "react";
import VaccineTable from "./components/vaccinelist";

const VaccineLibrary = () => {
  return (
    <div className="w-full h-screen top-[141px] left-[341px] mx-auto gap-[68px] p-6">
     <VaccineTable/>
    </div>
  );
};

export default VaccineLibrary;
