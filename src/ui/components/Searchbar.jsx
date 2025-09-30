import React from "react"

import { ICONS } from "../constants/assets"
const Searchbar = ({ placeholder = "Search...", value, onChange }) => {
  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <img
        src={ICONS.search}
        alt="search-icon"
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      />

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border bg-background text-foreground placeholder:text-muted-foreground pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
      />
    </div>
  )
}

export default Searchbar
