import NotificationsList from "./components/Notificationlist"
import SearchBar from "../../components/Searchbar";
import { ICONS } from "../../constants/assets"
import { useState } from "react"
import { STYLES } from "../../theme/typography/styles"
import { dashboardlabels } from "../../constants/pages/Labels"

export default function Notification() {
  const [query, setQuery] = useState("")

  return (
    <div className=" w-full p-6 top-[145px] left-[355px] gap-[19px] ">
      <div className="mb-6 flex items-center justify-between gap-3">

        <div className="relative flex-1 max-w-md mb-4">
          <SearchBar
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm text-foreground hover:bg-muted"
          aria-haspopup="dialog"
          aria-label={dashboardlabels.selectDate}
        >
          <img src={ICONS.calender} alt="calendar-icon" className="h-4 w-4" />
          <span>{dashboardlabels.dateValue}</span>
          <img src={ICONS.dropDownArrow} alt="dropdown-icon" className="h-3 w-3" />
        </button>
      </div>

      <div className="mb-4 flex items-baseline justify-between">
        <h2 style={STYLES.dashboard_title}>
          {dashboardlabels.notificationsTitle}
        </h2>
        <span className="text-sm text-muted-foreground">
          {dashboardlabels.notificationsCount}
        </span>
      </div>

      <NotificationsList />
    </div>
  )
}
