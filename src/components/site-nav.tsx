import { useEffect, useRef, type ReactElement } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";

import {
  WaButton,
  WaDropdown,
  WaDropdownItem,
  WaIcon,
} from "@/design-system/font-awsome-web-awesome-171158";
import { BrandMark } from "@/components/brand-mark";

type NavTarget = "/" | "/changelog" | "/terms" | "/privacy" | "/licenses";

const PAGES: ReadonlyArray<{ to: NavTarget; label: string; icon: string }> = [
  { to: "/", label: "Home", icon: "house" },
  { to: "/changelog", label: "Changelog", icon: "clock-rotate-left" },
  { to: "/terms", label: "Terms of Service", icon: "file-lines" },
  { to: "/privacy", label: "Privacy Policy", icon: "shield-halved" },
  { to: "/licenses", label: "Licenses", icon: "scale-balanced" },
];


/**
 * Site header: brand link plus a menu with sign in, register and the
 * public pages. Placement only — components keep their own styling.
 */
export function SiteNav(): ReactElement {
  const navigate = useNavigate();
  const router = useRouter();
  const menuRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    function handleSelect(event: Event) {
      const item = (event as CustomEvent<{ item: HTMLElement }>).detail?.item;
      const value = item?.getAttribute("value");
      if (!value) return;
      if (value === "signin" || value === "signup") {
        void navigate({ to: "/", search: { mode: value } });
        return;
      }
      void navigate({ to: value as NavTarget });
    }
    // Opening the menu is a strong hint the visitor is about to change page,
    // so fetch those routes now instead of after the click.
    function handleShow() {
      for (const page of PAGES) void router.preloadRoute({ to: page.to });
    }
    menu.addEventListener("wa-select", handleSelect);
    menu.addEventListener("wa-show", handleShow);
    return () => {
      menu.removeEventListener("wa-select", handleSelect);
      menu.removeEventListener("wa-show", handleShow);
    };
  }, [navigate, router]);

  return (
    <header
      className="wa-split wa-gap-m"
      style={{
        maxWidth: "68rem",
        marginInline: "auto",
        paddingBlock: "var(--wa-space-m)",
        paddingInline: "var(--wa-space-l)",
      }}
    >
      <Link
        to="/"
        className="wa-cluster wa-gap-2xs"
        style={{
          fontWeight: "var(--wa-font-weight-semibold)",
          textDecoration: "none",
          color: "var(--wa-color-text-normal)",
        }}
      >
        <BrandMark /> Crosspost
      </Link>

      <WaDropdown ref={menuRef}>
        <WaButton slot="trigger" appearance="outlined" size="s" with-caret>
          <WaIcon slot="start" name="bars" /> Menu
        </WaButton>
        <WaDropdownItem value="signin">
          <WaIcon slot="icon" name="right-to-bracket" /> Log in
        </WaDropdownItem>
        <WaDropdownItem value="signup">
          <WaIcon slot="icon" name="user-plus" /> Register
        </WaDropdownItem>
        {PAGES.map((page) => (
          <WaDropdownItem key={page.to} value={page.to}>
            <WaIcon slot="icon" name={page.icon} /> {page.label}
          </WaDropdownItem>
        ))}
      </WaDropdown>
    </header>
  );
}
