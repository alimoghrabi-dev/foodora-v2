import {
  Bike,
  Crown,
  Footprints,
  NotepadText,
  Store,
  UserRound,
} from "lucide-react";

export const dropDownMenuLinks = [
  {
    label: "Try FoodoraPro",
    href: "/subscriptions",
    icon: Crown,
  },
  {
    label: "Orders & Reordering",
    href: "/orders",
    icon: NotepadText,
  },
  {
    label: "Profile",
    href: "/account",
    icon: UserRound,
  },
];

export const navbarBottomLinks = [
  {
    label: "Delivery",
    href: "/market",
    icon: Bike,
  },
  {
    label: "Pick-up",
    href: "/pick-up",
    icon: Footprints,
  },
  {
    label: "Shops",
    href: "/shops",
    icon: Store,
  },
];
