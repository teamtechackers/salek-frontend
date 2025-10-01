// src/ui/components/Styles/buttonstyling.jsx

export const BUTTON_BASE = "flex items-center justify-center rounded-[14px] gap-[10px] text-white";
export const BUTTON_SIZE = "w-[249px] h-[60px]";
export const Catagory= "flex flex-row w-[167px] h-[49px] rounded-md gap-3 items-center" 
import { COLORS } from "../../theme/colors/colors";

export const BUTTON_COLORS = {
  delete: "bg-red-500 hover:bg-red-600",
  cancel: "bg-gray-400 hover:bg-gray-500"
};

export const STYLES = {
  deleteButton: [BUTTON_BASE, BUTTON_SIZE, BUTTON_COLORS.delete].join(" "),
  cancelButton: [BUTTON_BASE, BUTTON_SIZE, BUTTON_COLORS.cancel].join(" "),
};
