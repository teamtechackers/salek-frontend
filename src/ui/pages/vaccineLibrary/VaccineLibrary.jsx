import React from "react";
import VaccineTable from "./components/vaccinelist";
import PageContainer from "../../components/PageContainer";

const VaccineLibrary = () => {
  return (
    <PageContainer>
      <VaccineTable />
    </PageContainer>
  );
};

export default VaccineLibrary;
