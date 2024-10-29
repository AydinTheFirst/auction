import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextNavbar,
} from "@nextui-org/react";
import {
  LucideChartPie,
  LucideHome,
  LucideInfo,
  LucideTag,
  LucideUser,
} from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";
import useSWR from "swr";

import { ThemeToggler } from "@/components/ThemeToggler";
import { LOGO_URL } from "@/config";
import { useDeviceType } from "@/hooks/useDeviceType";
import { User } from "@/types";

const menuItems = [
  {
    href: "/",
    icon: LucideHome,
    isAdmin: false,
    isAuth: false,
    label: "Anasayfa",
  },
  {
    href: "/yardim",
    icon: LucideInfo,
    isAdmin: false,
    isAuth: false,
    label: "Yardım",
  },
  {
    href: "/auctions",
    icon: LucideTag,
    isAdmin: false,
    isAuth: true,
    label: "Mezatlar",
  },
  {
    href: "/dashboard",
    icon: LucideChartPie,
    isAdmin: true,
    isAuth: true,
    label: "Yönetim Paneli",
  },
];

export default function Navbar() {
  const { data: me } = useSWR<User>("/auth/me", {
    onError: () => {},
  });
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const pathname = useLocation().pathname;

  const isLoggedIn = !!me;
  const isAdmin = me && me.roles.includes("ADMIN");

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.isAuth && !isLoggedIn) return false;
    if (item.isAdmin && !isAdmin) return false;
    return true;
  });

  return (
    <NextNavbar
      className="bg-[#ffffff] shadow dark:bg-[#18181b]"
      maxWidth="2xl"
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as={Link} href={"/"}>
          <AcmeLogo />
          <div className="mx-1 text-center font-bold text-foreground">
            <h4 className="hidden md:block">Auction</h4>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {filteredMenuItems.map((item, index) => (
          <NavbarItem isActive={pathname === item.href} key={index}>
            <Link color="foreground" href={item.href}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeToggler />
        </NavbarItem>
        <NavbarItem className="flex gap-1">
          <AuthItem />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {filteredMenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Button
              as={Link}
              className="justify-start"
              fullWidth
              href={item.href}
              startContent={<item.icon />}
              variant="light"
            >
              <strong>{item.label}</strong>
            </Button>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextNavbar>
  );
}

const AcmeLogo = () => (
  <img alt="Logo" className="aspect-auto h-10" src={LOGO_URL} />
);

const AuthItem = () => {
  const { data: me } = useSWR<User>("/auth/me", {
    onError: () => {},
  });

  const { isMobile } = useDeviceType();

  if (!me) {
    return (
      <>
        <Button as={Link} color="primary" href="/login">
          <strong>Giriş Yap</strong>
        </Button>
        <Button as={Link} color="primary" href="/register" variant="flat">
          <strong>Kayıt Ol</strong>
        </Button>
      </>
    );
  }

  const logout = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly={isMobile}
          startContent={<LucideUser />}
          variant="faded"
        >
          <strong className="mt-1 hidden md:block">{me.firstName}</strong>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem href="/profile" key="profile">
          Hesabım
        </DropdownItem>
        <DropdownItem
          className="text-danger"
          color="danger"
          key="delete"
          onClick={logout}
        >
          Çıkış Yap
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
