import Card from "./components/Card";
import { DASHBOARD_CARDS } from "../../constants/pages/DashboardConstants";
const Dashboard = () => {
  return (
    <div className="w-full p-6 h-screen flex gap-4">
      
      <div className="w-[60%] flex flex-col gap-4">

        <div className="h-[45%] bg-blue-200 rounded-2xl shadow-md p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Title</h2>

          <h3 className="text-md font-medium mb-4">Heading</h3>

          <div className="grid grid-cols-2 gap-4">
            {DASHBOARD_CARDS.map((card, idx) => (
              <Card
                key={idx}
                title={card.title}
                value={card.value}
                name={card.name}
                icon={card.icon}
              />
            ))}
          </div>
        </div>

        <div className="h-[55%] bg-green-200 rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold">Box 2</h2>
        </div>
        
      </div>

      <div className="w-[40%] h-full bg-yellow-200 rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold">Box 3</h2>
      </div>
    </div>
  );
};

export default Dashboard;
