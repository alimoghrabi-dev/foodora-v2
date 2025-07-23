import { MdRestaurantMenu } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { BiSolidOffer } from "react-icons/bi";
import { IoHourglassOutline, IoSettings } from "react-icons/io5";
import { FaList } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";

export const SideLinks = [
  {
    label: "Dashboard",
    icon: LuLayoutDashboard,
    isDisabledByPublish: false,
    href: "/",
  },
  {
    label: "Menu",
    icon: MdRestaurantMenu,
    isDisabledByPublish: false,
    href: "/menu",
  },
  {
    label: "Opening Hours",
    icon: IoHourglassOutline,
    isDisabledByPublish: true,
    href: "/opening-hours",
  },
  {
    label: "Orders",
    icon: FaList,
    isDisabledByPublish: true,
    href: "/orders",
  },
];

export const ProfileSideLinks = [
  {
    label: "Profile Management",
    icon: FaUserAlt,
    href: "/profile-management",
  },
  {
    label: "Settings",
    icon: IoSettings,
    href: "/settings",
  },
  {
    label: "Sale Management",
    icon: BiSolidOffer,
    href: "/sale-management",
  },
];
