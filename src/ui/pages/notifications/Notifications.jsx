"use client"

import NotificationsList from "./components/Notificationlist"
import { ICONS } from "../../constants/assets"
import { useState } from "react"
import Searchbar from "../../components/Searchbar"
import { STYLES } from "../../theme/typography/styles"
// import notificationLabels from "../../utils/strings/pages/notificationLabels"
import { dashboardlabels } from "../../constants/pages/Labels"
export default function Notification() {
  const [query, setQuery] = useState("")

  return (
    <main className="max-w-5xl mx-auto p-6 ">
      {/* Top toolbar */}
      <div className="mb-6 flex items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Searchbar
            placeholder={dashboardlabels.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Date selector (static) */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm text-foreground hover:bg-muted"
          aria-haspopup="dialog"
          aria-label={dashboardlabels.selectDate}
        >
          <img src={ICONS.calendar} alt="calendar-icon" className="h-4 w-4" />
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

      {/* Section header */}
      <div className="mb-4 flex items-baseline justify-between">
        <h2 style={STYLES.dashboard_title}>
          {dashboardlabels.notificationsTitle}
        </h2>
        <span className="text-sm text-muted-foreground">
          {dashboardlabels.notificationsCount}
        </span>
      </div>

      {/* List */}
      <NotificationsList />
    </main>
  )
}
