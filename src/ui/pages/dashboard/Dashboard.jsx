import ListBox from "./components/ListBox";
import CardBox from "./components/CardBox";
import GraphBox from "./components/GraphBox";

const Dashboard = () => {
  return (
    <div className="flex-1 p-4 flex gap-4 h-full">
      <div className="flex-2 flex flex-col h-full gap-4">
        <CardBox />
        <GraphBox />
      </div>
        <ListBox />
    </div>
  );
};

export default Dashboard;
