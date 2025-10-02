import { useEffect, useRef } from "react";
import { dashboardlabels } from "../../../constants/pages/Labels";
import { ICONS } from "../../../constants/assets";
import { STYLES } from "../../../components/Styles/buttonstyling";
import { FONTS } from "../../../theme/typography/fonts";
import { vaccineLabels } from "../../../constants/data/EditVaccinelabels";
import { COLORS } from "../../../theme/colors/colors";
import { GlobalStyles, Subheader } from "../../../components/Styles/GlobalStyles";

export default function EditModel({ open, onClose }) {
  const closeRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement;
      const t = setTimeout(() => closeRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";

      const onKey = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKey);

      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
        if (previouslyFocused.current instanceof HTMLElement) {
          previouslyFocused.current.focus();
        }
        clearTimeout(t);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-model-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 " />

      {/* Modal Card */}
      <div className="relative flex flex-col w-[613px] h-[762px] rounded-[39px]  shadow-xl overflow-hidden" style={{background:COLORS.white}}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-[84px] px-[40px] py-[19px]  rounded-t-[39px]"style={{background:COLORS.blue}}>
          <h2 id="edit-model-title" className="text-lg font-semibold "style={{color:COLORS.blue}}>
            {dashboardlabels.editVaccine || vaccineLabels.header}
          </h2>
          <button
            aria-label="Close"
            onClick={onClose}
            ref={closeRef}
            className="hover:opacity-80 transition"
          >
            <img src={ICONS.cross} alt="close" className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 px-10 py-6 text-gray-700 overflow-y-auto">
          
          {/* Sub Header */}
          <div className={GlobalStyles.Subheader}>
            <h3 className="text-lg font-bold">{vaccineLabels.subHeader}</h3>
          </div>

          {/* Info Section */}
          <div className="flex flex-col gap-2 text-sm leading-relaxed">
            {vaccineLabels.info.map((item) => (
              <p key={item.label} className="flex justify-between">
                <div className="font-semibold">{item.label}:</div>
                <div>{item.value}</div>
              </p>
            ))}
          </div>

          {/* Footer Notes */}
          <footer className="flex flex-col w-full rounded-[15px] px-5 py-3 gap-1 bg-gray-50 shadow-sm">
            <span className="font-semibold">Notes:</span> {vaccineLabels.notes}
          </footer>

          {/* Action Buttons */}
          <div className="flex items-center justify-center h-[60px] gap-5 mt-4">
            <button className={STYLES.editButton} style={FONTS.inter_600_20_20_white}>
              {vaccineLabels.actions.edit}
            </button>
            <button className={STYLES.deleteButton} style={FONTS.inter_600_20_20_white}>
              {vaccineLabels.actions.delete}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
