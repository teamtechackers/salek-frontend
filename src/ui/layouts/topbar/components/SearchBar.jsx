import { ICONS } from "../../../constants/assets";

const SearchBar = () => {
  return (
    <div className="flex items-center flex-1 max-w-md bg-white rounded-2xl shadow-sm px-4 py-3 border border-gray-100">
      
      <img src={ICONS.topbarSearchIcon} alt="Search" className="w-5 h-5 mr-3" />

      <input
        type="text"
        placeholder="Search"
        className="w-full bg-white text-black placeholder-black outline-none"
      />
    </div>
  );
};

export default SearchBar;
