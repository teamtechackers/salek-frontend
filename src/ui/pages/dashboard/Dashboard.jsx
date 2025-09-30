import Card from "./components/Card";
import { DASHBOARD_CARDS } from "../../constants/pages/DashboardConstants";

const Dashboard = () => {
  return (
    <div className="flex-1 p-4 flex gap-4 h-full">
      
      {/* LEFT SIDE */}
      <div className="flex-2 flex flex-col h-full gap-4">
        
        {/* Box 1 (40%) */}
        <div className="flex-1 max-h-[45%]  bg-gray-100 rounded-2xl shadow-md p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
          <h3 className="text-md font-medium mb-4">
            From reminders to records, everything you need at a glance.
          </h3>

          {/* Dynamic grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
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

        {/* Box 2 (60%) */}
        <div className="flex-1 max-h-[55%] bg-gray-100 rounded-2xl shadow-md p-4 flex flex-col">
          <h2 className="text-lg font-semibold">Box 2</h2>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-gray-100 rounded-2xl shadow-md p-4 h-full">
        <h2 className="text-lg font-semibold">Box 3</h2>
      </div>
    </div>
  );
};

export default Dashboard;
