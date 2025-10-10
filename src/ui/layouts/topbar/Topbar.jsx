import SearchBar from "./components/SearchBar";
import UserDetails from "./components/UserDetails";

const Topbar = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 rounded-3xl mx-4 w-auto">
      <SearchBar />
      <UserDetails />
    </header>
  );
};

export default Topbar;
