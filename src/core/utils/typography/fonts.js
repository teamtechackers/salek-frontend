// src/utils/typography/fonts.js
import { FONT_FAMILIES, FONT_SIZES, COLORS } from "../constants/typoconstants";

export const FONTS = {
  // Page title "Log In Account"
  inter_500_38_38: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.xl,
    fontWeight: 500,
    lineHeight: "100%", // 38px
  },

  // Labels (Email, Password, Terms)
  inter_600_20_20: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.lg,
    fontWeight: 600,
    lineHeight: "100%", // 20px
  },

  // Terms text
  inter_600_20_20_gray: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.lg,
    fontWeight: 600,
    lineHeight: "100%", // 20px
    color: COLORS.gray600, // ✅ use constant
  },

  // Button text
  inter_600_20_20_white: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.lg,
    fontWeight: 600,
    lineHeight: "100%", // 20px
    color: COLORS.white, // ✅ use constant
  },

  // Input text (email, password fields)
  inter_400_16_24: {
    fontFamily: FONT_FAMILIES.inter,
    fontSize: FONT_SIZES.base,
    fontWeight: 400,
    lineHeight: "24px",
  },
};
