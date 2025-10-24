import { useEffect } from "react";
import ListBox from "./components/ListBox";
import CardBox from "./components/CardBox";
import GraphBox from "./components/GraphBox";
import { useGetDashboardQuery } from "../../../core/services/api/dashboardApi";

const Dashboard = () => {
  const adminId = localStorage.getItem("adminId");
  const { data, error, isLoading, refetch } = useGetDashboardQuery(adminId);

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error.message}</div>;

  const totals = data?.data?.totals || {};
  const graphData = data?.data?.graph || [];

  return (
    <div className="flex-1 p-4 flex gap-4 h-full ">
      <div className="flex-2 flex flex-col h-full gap-4">
        <CardBox totals={totals} />
        <GraphBox graphData={graphData} />
      </div>
        <ListBox />
    </div>
  );
};

export default Dashboard;
