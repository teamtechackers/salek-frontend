import { COLORS } from "../colors/colors"
import { FONTS } from "./fonts"

export const STYLES = {
  // Page title "Log In Account"
  page_title: {
    color: COLORS.black,
    ...FONTS.inter_500_38_38,
  },
dashboard_title: {
    color: COLORS.black,
    ...FONTS.inter_500_38_38,
  },
  // Field labels (Email, Password, Terms)
  field_label: {
    color: COLORS.darkGray,
    ...FONTS.inter_600_20_20,
  },

  // Input text
  input_text: {
    color: COLORS.darkGray,
    ...FONTS.inter_400_16_24,
  },

  // Terms + conditions text
  terms_text: {
    color: COLORS.darkGray,
    ...FONTS.inter_600_20_30_gray,
  },

  // Link (Terms & Conditions link specifically)
  link_text: {
    color: COLORS.blue, // or COLORS.primary if you have that defined
    ...FONTS.inter_600_20_30,
  },
delete_button: {
    color: COLORS.white,
    ...FONTS.inter_600_20_20_red,
  },
  cancel_button: {
    color: COLORS.white,
    ...FONTS.inter_600_20_20_gray,
  },
  // Submit button text
  button_text: {
    color: COLORS.white,
    ...FONTS.inter_600_20_20_white,
  },
}
