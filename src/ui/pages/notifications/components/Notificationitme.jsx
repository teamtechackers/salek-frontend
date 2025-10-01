"use client"

import { ConfirmDeleteModal } from "../../../components/confirmdeletemodel"
import { ICONS } from "../../../constants/assets"
import { useState } from "react"
import { dashboardlabels } from "../../../constants/pages/Labels"
import { STYLES } from "../../../theme/typography/styles"
// import { UI_CONSTANTS } from "../../../constants/ui"  // ✅ import

export default function NotificationItem({
  name,
  message,
  time,
  avatarUrl,
  selected,
  onDelete,
}) {
  const [open, setOpen] = useState(false)
  return (
    <li
      role="listitem"
      aria-selected={selected}
      className="mb-3 flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-muted aria-selected:bg-secondary"
    >
      <img
        src={avatarUrl || dashboardlabels.avatarPlaceholder}  // ✅ use constant
        alt={dashboardlabels.avatarAlt(name)}                // ✅ use constant
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className={STYLES.field_label}>{name}</p>
        <p className={STYLES.field_label}>{message}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label={dashboardlabels.deleteNotificationLabel(name)} // ✅ use constant
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <img src={ICONS.deletenotification} alt="Delete" />
        </button>
        <ConfirmDeleteModal
          open={open}
          title={dashboardlabels.title}
          description={dashboardlabels.description}
          onClose={() => setOpen(false)}
          onConfirm={async () => {
            await onDelete()
            setOpen(false)
          }}
        />
        <span className="w-16 text-right text-xs text-muted-foreground">{time}</span>
      </div>
    </li>
  )
}
