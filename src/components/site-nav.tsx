import { Fragment, useEffect, useRef, type ReactElement } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";

import {
  WaButton,
  WaDivider,
  WaDropdown,
  WaDropdownItem,
  WaIcon,
} from "@/design-system/font-awsome-web-awesome-171158";
import { BrandMark } from "@/components/brand-mark";

type NavTarget =
  | "/"
  | "/changelog"
  | "/terms"
  | "/privacy"
  | "/licenses"
  | "/docs/setup"
  | "/docs/posting"
  | "/docs/tokens"
  | "/docs/troubleshooting"
  | "/docs/security";

interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly icon: string;
}

interface NavGroup {
  readonly title: string;
  readonly items: ReadonlyArray<NavItem>;
}

const GROUPS: ReadonlyArray<NavGroup> = [
  {
    title: "Account",
    items: [
      { href: "/?mode=signin", label: "Log in", icon: "right-to-bracket" },
      { href: "/?mode=signup", label: "Register", icon: "user-plus" },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/docs/setup", label: "Setup guide", icon: "list-check" },
      { href: "/docs/posting", label: "Posting", icon: "paper-plane" },
      { href: "/docs/tokens", label: "Tokens & keys", icon: "key" },
      {
        href: "/docs/troubleshooting",
        label: "Troubleshooting",
        icon: "life-ring",
      },
      { href: "/docs/security", label: "Security", icon: "lock" },
    ],
  },
  {
    title: "Site",
    items: [
      { href: "/", label: "Home", icon: "house" },
      { href: "/changelog", label: "Changelog", icon: "clock-rotate-left" },
    ],
  },
  {
    title: "Legal",
    items: [
      { href: "/terms", label: "Terms of Service", icon: "file-lines" },
      { href: "/privacy", label: "Privacy Policy", icon: "shield-halved" },
      { href: "/licenses", label: "Licenses", icon: "scale-balanced" },
    ],
  },
];

const ROUTES: ReadonlyArray<NavTarget> = [
  "/",
  "/changelog",
  "/terms",
  "/privacy",
  "/licenses",
  "/docs/setup",
  "/docs/posting",
  "/docs/tokens",
  "/docs/troubleshooting",
  "/docs/security",
];


/**
 * Site header: brand link plus a grouped Web Awesome dropdown menu whose
 * items are real links. Selection is routed client-side.
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
      const href = item?.getAttribute("href");
      if (!href) return;
      event.preventDefault();
      const [path, query] = href.split("?");
      const mode = query ? new URLSearchParams(query).get("mode") : null;
      if (mode === "signin" || mode === "signup") {
        void navigate({ to: "/", search: { mode } });
        return;
      }
      void navigate({ to: (path || "/") as NavTarget });
    }
    // Opening the menu is a strong hint the visitor is about to change page,
    // so fetch those routes now instead of after the click.
    function handleShow() {
      for (const to of ROUTES) void router.preloadRoute({ to });
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
        {GROUPS.map((group, index) => (
          <Fragment key={group.title}>
            {index > 0 ? <WaDivider /> : null}
            <div
              role="presentation"
              style={{
                paddingBlock: "var(--wa-space-2xs)",
                paddingInline: "var(--wa-space-m)",
                fontSize: "var(--wa-font-size-xs)",
                fontWeight: "var(--wa-font-weight-semibold)",
                color: "var(--wa-color-text-quiet)",
              }}
            >
              {group.title}
            </div>

            {group.items.map((item) => (
              <WaDropdownItem key={item.href} href={item.href}>
                <WaIcon slot="icon" name={item.icon} /> {item.label}
              </WaDropdownItem>
            ))}
          </Fragment>
        ))}
      </WaDropdown>
    </header>
  );
}
