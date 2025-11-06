import Card from "./Card";
import { DASHBOARD_CARDS } from "../../../constants/pages/DashboardConstants";

const CardBox = ({ totals }) => { // Accept totals prop
  const getCardValue = (title) => {
    switch (title) {
      case "Total Users":
        return totals.users;
      case "Vaccine Logged":
        return totals.completed_vaccines;
      case "Active Users":
        return totals.total_users_with_dependents; // Assuming this maps to active users
      case "Notifications":
        return DASHBOARD_CARDS.find(card => card.title === "Notifications")?.value; // Keep existing value if no API data
      default:
        return "N/A";
    }
  };

  return (
    <div className="flex-1 max-h-[48%] bg-[#EDF5FF] rounded-2xl shadow-md p-4 flex flex-col">
        {/* <h2 className="text-lg font-semibold mb-2">Dashboard</h2> */}
        <h3 className="text-md  mb-4">
        From reminders to records, everything you need at a glance.
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {DASHBOARD_CARDS.map((card, idx) => (
            <Card
            key={idx}
            title={card.title}
            value={getCardValue(card.title)} // Use dynamic value from API
            name={card.name}
            icon={card.icon}
            x
            />
        ))}
        </div>
    </div>
  );
};

export default CardBox;
