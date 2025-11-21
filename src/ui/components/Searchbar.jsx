import { useRef } from "react";
import { ICONS } from "../constants/assets";

const SearchBar = ({ value, onChange, onSearch }) => {
  // Create a ref to access the input element
  const inputRef = useRef(null);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      // Always trigger search when Enter is pressed
      // Use the current value from the input field to ensure we have the latest value
      onSearch(inputRef.current?.value || value);
    }
  };

  const handleSearchClick = () => {
    // Always trigger search when search icon is clicked
    if (onSearch) {
      // Use the current value from the input field to ensure we have the latest value
      onSearch(inputRef.current?.value || value);
    }
  };

  return (
    <div className="flex items-center flex-1 max-w-xs bg-white rounded-lg shadow-sm px-2 py-2 border border-gray-100" >
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-white text-black placeholder-black outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        ref={inputRef}
        onKeyDown={handleKeyDown}
      />
      <img 
        src={ICONS.topbarSearchIcon} 
        alt="Search" 
        className="w-5 h-5 ml-3 cursor-pointer" 
        onClick={handleSearchClick}
      />
    </div>
  );
};

export default SearchBar;
