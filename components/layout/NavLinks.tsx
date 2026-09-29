"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { MAIN_NAV } from "@/lib/site";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-2 xl:gap-5">
      {MAIN_NAV.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-[15px] font-medium transition duration-150",
                active ? "text-lime" : "text-white hover:text-lime",
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
