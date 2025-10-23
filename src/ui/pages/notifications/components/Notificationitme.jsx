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
      className={`flex items-center gap-3 rounded-xl shadow-sm p-2 mb-2 `}
    >
      <img
        src={avatarUrl || dashboardlabels.avatarPlaceholder}
        alt={dashboardlabels.avatarAlt(name)}
        className="h-10 w-10 shrink-0 rounded-full object-cover" // Adjusted size
      />

      <div className="flex-1"> {/* Adjusted flex for message */}
        <p className="font-bold text-gray-800">{name}</p> {/* Adjusted styling */}
        <p className="text-md text-gray-600">{message}</p> {/* Adjusted styling */}
      </div>

      <div className="flex flex-col items-end gap-1"> {/* Adjusted layout for time and delete */}
        <button  className="p-2 rounded-md hover:bg-red-100 cursor-pointer"          onClick={() => setOpen(true)}
>
          <img src={ICONS.delete} alt="Delete" />
        </button>


        <span className="text-xs text-gray-500">{time}</span> {/* Adjusted styling */}
      </div>
        
       <ConfirmDeleteModal
        open={open}
        title={dashboardlabels.title}
        description={dashboardlabels.description}
        onClose={() => setOpen(false)}
        onConfirm={async () => {
          setOpen(false)
        }}
      />
    </li>
  )
}
