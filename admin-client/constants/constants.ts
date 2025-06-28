import { MdRestaurantMenu } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoHourglassOutline } from "react-icons/io5";
import { FaList } from "react-icons/fa6";

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
