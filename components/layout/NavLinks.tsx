"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { MAIN_NAV } from "@/lib/site";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-1">
      {MAIN_NAV.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition duration-150",
                active ? "text-brand" : "text-chrome-muted hover:text-chrome",
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
