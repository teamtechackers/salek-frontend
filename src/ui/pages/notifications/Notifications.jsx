import NotificationsList from "./components/Notificationlist"
import { ICONS } from "../../constants/assets"
import { useState } from "react"
import SearchBar from "../../layouts/topbar/components/SearchBar";
import { STYLES } from "../../theme/typography/styles"
import { dashboardlabels } from "../../constants/pages/Labels"

export default function Notification() {
  const [query, setQuery] = useState("")

  return (
    <main className=" w-full p-6 top-[145px] left-[355px] gap-[19px] ">
      <div className="mb-6 flex items-center justify-between gap-3">

        <div className="relative flex-1 max-w-md">
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
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <polyline
              points="6 9 12 15 18 9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
    </main>
  )
}
