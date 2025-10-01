import React from "react"

import { ICONS } from "../constants/assets"
import { STYLES } from "../theme/typography/styles"
const Searchbar = ({ placeholder , value, onChange }) => {
  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <img
        src={ICONS.topbarSearchIcon}
        alt="search-icon"
        className={STYLES.search_icon.search}
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
