import { Box, Home, Tag, Users } from "lucide-react";

export const sidebarItems = [
  {
    canCreate: false,
    href: "/dashboard",
    icon: Home,
    label: "Yönetim Paneli",
  },
  {
    canCreate: true,
    href: "/dashboard/users",
    icon: Users,
    label: "Kullanıcılar",
  },
  {
    canCreate: true,
    href: "/dashboard/products",
    icon: Box,
    label: "Ürünler",
  },
  {
    canCreate: true,
    href: "/dashboard/auctions",
    icon: Tag,
    label: "Mezatlar",
  },
];
