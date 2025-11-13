import { useLocation } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import UserDetails from "./components/UserDetails";

const Topbar = () => {
  const location = useLocation();

  const path = location.pathname;

  const pageTitle = path
    .replace("/", "") // remove leading slash
    .split("-") // split words by "-"
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize
    .join(" ") || "Dashboard"; // default title

  // const isDashboard = path === "/app/dashboard" || path === "/";

  return (
    <header className="flex items-center justify-between p-4 bg-[#EDF5FF] rounded-3xl mx-4 w-auto">
      {/* {isDashboard ? (
        <SearchBar />
      ) : ( */}
        <h2 className="text-2xl font-semibold text-black ml-4">{pageTitle}</h2>
      {/* )} */}
      <UserDetails />
    </header>
  );
};

export default Topbar;
