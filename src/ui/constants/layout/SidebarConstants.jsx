import { ICONS } from "../assets";

export const ROUTES = {
  DASHBOARD: "/app/dashboard",
  USER: "/app/user",
  VACCINE_LIBRARY: "/app/vaccine-library",
  NOTIFICATIONS: "/app/notifications",
};

export const NAMES = {
  DASHBOARD: "Dashboard",
  USER: "User",
  VACCINE_LIBRARY: "Vaccine Library",
  NOTIFICATIONS: "Notifications",
};

export const SIDEBAR_LINKS = [
  {
    name: NAMES.DASHBOARD,
    path: ROUTES.DASHBOARD,
    iconDefault: ICONS.dashboardIconWhite,
    iconActive: ICONS.dashboardIconBlue,
  },
  {
    name: NAMES.USER,
    path: ROUTES.USER,
    iconDefault: ICONS.userIconWhite,
    iconActive: ICONS.userIconBlue,
  },
  {
    name: NAMES.VACCINE_LIBRARY,
    path: ROUTES.VACCINE_LIBRARY,
    iconDefault: ICONS.vaccineIconWhite,
    iconActive: ICONS.vaccineIconBlue,
  },
  {
    name: NAMES.NOTIFICATIONS,
    path: ROUTES.NOTIFICATIONS,
    iconDefault: ICONS.notificationIconWhite,
    iconActive: ICONS.notificationIconBlue,
  },
];
