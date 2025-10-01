import { FONT_FAMILIES, FONT_SIZES } from "../../constants/typoconstants";
import { COLORS } from "../colors/colors";

export const FONTS = {

  // Page title "Log In Account"
  inter_500_38_38: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.lg,
    fontWeight: 500,
    lineHeight: "100%", // 38px
    color: COLORS.gray, // ✅ titles usually use dark gray
  },

  // Labels (Email, Password, Terms)
  inter_600_20_20: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.lg,
    fontWeight: 600,
    lineHeight: "100%", // 20px
    color: COLORS.gray, // ✅ labels are usually medium-dark
  },

  inter_600_20_20_red: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.lg,
    fontWeight: 600,
    lineHeight: "100%", // 20px
    color: COLORS.white, // text color
    backgroundColor: COLORS.red, // 👈 add bg color
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
  },

  inter_600_20_20_gray: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.lg,
    fontWeight: 600,
    lineHeight: "100%",
    color: COLORS.black,
    backgroundColor: COLORS.grayDark, // 👈 bg gray
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
  },

  // Terms text
  inter_600_20_20_gray: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.lg,
    fontWeight: 600,
    lineHeight: "100%", // 20px
    color: COLORS.gray, // ✅ muted gray
  },

  // Button text
  inter_600_20_20_white: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.lg,
    fontWeight: 600,
    lineHeight: "100%", // 20px
    color: COLORS.white, // ✅ white on blue button
  },

  // Input text (email, password fields)
  inter_400_16_24: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.base,
    fontWeight: 400,
    lineHeight: "24px",
    color: COLORS.gray700, // ✅ text inside input
  },
  // Disabled input text
  inter_400_16_24_disabled: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.base,
    fontWeight: 400,
    lineHeight: "24px",
    color: COLORS.gray700, // ✅ muted gray for disabled state
  },
};
