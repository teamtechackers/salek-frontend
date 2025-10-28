import { ICONS } from "../constants/assets";

const SearchBar = ({ value, onChange, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="flex items-center flex-1 max-w-md bg-white rounded-lg shadow-sm px-4 py-4 border border-gray-100 " >
      
      <img src={ICONS.topbarSearchIcon} alt="Search" className="w-5 h-5 mr-3" />

      <input
        type="text"
        placeholder="Search"
        className="w-full bg-white text-black placeholder-black outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBar;
