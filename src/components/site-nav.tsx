import { useEffect, useRef, type ReactElement } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

import {
  WaBadge,
  WaButton,
  WaDropdown,
  WaDropdownItem,
  WaIcon,
} from "@/design-system/font-awsome-web-awesome-171158";


type NavTarget = "/" | "/terms" | "/privacy" | "/licenses";

const PAGES: ReadonlyArray<{ to: NavTarget; label: string; icon: string }> = [
  { to: "/", label: "Home", icon: "house" },
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
    menu.addEventListener("wa-select", handleSelect);
    return () => menu.removeEventListener("wa-select", handleSelect);
  }, [navigate]);

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
        <WaIcon name="repeat" /> Crosspost
        <WaBadge variant="neutral" appearance="outlined" pill>
          Beta
        </WaBadge>

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
