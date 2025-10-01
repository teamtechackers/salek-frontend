import { useEffect, useRef } from "react"
import { ICONS, IMAGES } from "../constants/assets"
import { dashboardlabels } from "../constants/pages/Labels"
import { STYLES } from "../theme/typography/styles"

export function ConfirmDeleteModal({
  open,
  title = dashboardlabels.title,
  description = dashboardlabels.description,
  onConfirm,
  onClose,
}) {
    const confirmRef = useRef(null)
    const previouslyFocused = useRef(null)

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement
      const t = setTimeout(() => confirmRef.current?.focus(), 0)
      document.body.style.overflow = "hidden"
      const onKey = (e) => {
        if (e.key === "Escape") onClose()
      }
      window.addEventListener("keydown", onKey)
      return () => {
        window.removeEventListener("keydown", onKey)
        document.body.style.overflow = ""
        if (previouslyFocused.current instanceof HTMLElement) {
          previouslyFocused.current.focus()
        }
        clearTimeout(t)
      }
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute inset-0 " />

      <div className="relative z-10 w-[92vw] max-w-[540px] overflow-hidden  bg-white rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between bg-blue-600 px-4 py-3">

          <h2 id="confirm-delete-title" className="text-base font-semibold text-white">
            {dashboardlabels.title}
          </h2>

          <button
            aria-label="Close"
            onClick={onClose}
          >
            <img src={ICONS.cross}
              className="h-5 w-5"
           />
              
          </button>
        </div>

        <div className="px-6 pb-6 pt-5">
          <div className="flex w-full flex-col items-center text-center">
            <img
              src={IMAGES.delete}
              alt="Delete confirmation illustration"
              className="mb-5 h-36 w-auto"
            />
            <p className="max-w-[36ch] text-balance text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              ref={confirmRef}
              onClick={onConfirm}
              className={` flex items-center justify-center w-[249px] h-[60px] rounded-[14px] gap-[10px] bg-[#D32220] text-white`}
            >
             {dashboardlabels.delete}
            </button>
            <button
              onClick={onClose}
              class={`flex items-center justify-center w-[249px] h-[60px] rounded-[14px] gap-[10px] bg-[#1843b929] text-white`}
            >
            {dashboardlabels.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
