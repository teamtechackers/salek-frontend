import { ICONS } from "../assets";

export const ROUTES = {
  DASHBOARD: "/dashboard",
  USER: "/user",
  VACCINE_LIBRARY: "/vaccine-library",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  LOCATION: "/settings/location",
};

export const NAMES = {
  DASHBOARD: "Dashboard",
  USER: "User",
  VACCINE_LIBRARY: "Vaccine Library",
  NOTIFICATIONS: "Notifications",
  SETTINGS: "Settings",
  LOCATION: "Location",
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
    name: NAMES.SETTINGS,
    path: ROUTES.SETTINGS,
    iconDefault: null, // Placeholder, relying on Sidebar to handle or fallback
    iconActive: null,
    children: [
      {
        name: NAMES.LOCATION,
        path: ROUTES.LOCATION,
        iconDefault: null, 
        iconActive: null,
      }
    ]
  },
  {
    name: NAMES.NOTIFICATIONS,
    path: ROUTES.NOTIFICATIONS,
    iconDefault: ICONS.notificationIconWhite,
    iconActive: ICONS.notificationIconBlue,
  },
];
