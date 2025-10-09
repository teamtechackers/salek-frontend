import ConfirmDeleteModal from "../../../../ui/components/ConfirmDeleteDialogBox"
import { ICONS } from "../../../constants/assets"
import { useState } from "react"
import { dashboardlabels } from "../../../constants/pages/Labels"
// import { STYLES } from "../../../theme/typography/styles" // Not needed if using Tailwind directly

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
      className={`flex items-center gap-3 rounded-lg shadow-sm p-3 mb-2 transition-colors ${ // Adjusted styling
        selected ? "bg-blue-50" : "bg-white hover:bg-gray-50" // Conditional background
      }`}
    >
      <img
        src={avatarUrl || dashboardlabels.avatarPlaceholder}
        alt={dashboardlabels.avatarAlt(name)}
        className="h-10 w-10 shrink-0 rounded-full object-cover" // Adjusted size
      />

      <div className="flex-1"> {/* Adjusted flex for message */}
        <p className="font-semibold text-gray-800">{name}</p> {/* Adjusted styling */}
        <p className="text-sm text-gray-600">{message}</p> {/* Adjusted styling */}
      </div>

      <div className="flex flex-col items-end gap-1"> {/* Adjusted layout for time and delete */}
        <button
          type="button"
          aria-label={dashboardlabels.deleteNotificationLabel(name)}
          onClick={() => setOpen(true)}
          className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" // Adjusted styling
        >
          <img src={ICONS.delete} alt="Delete" className="w-4 h-4" /> {/* Using generic delete icon */}
        </button>
        <span className="text-xs text-gray-500">{time}</span> {/* Adjusted styling */}
      </div>
        
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
    </li>
  )
}
