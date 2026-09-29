"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { searchHref } from "@/lib/listing-query";
import { cn } from "@/lib/cn";

interface HeaderSearchProps {
  className?: string;
}

export function HeaderSearch({ className }: HeaderSearchProps) {
  const router = useRouter();
  const [text, setText] = useState("");

  return (
    <form
      role="search"
      className={cn("relative", className)}
      onSubmit={(event) => {
        event.preventDefault();
        router.push(searchHref({ text: text.trim() || undefined }));
      }}
    >
      <label htmlFor="header-search" className="sr-only">
        Buscar carro por marca ou modelo
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-chrome-muted"
      />
      <input
        id="header-search"
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Busque por marca ou modelo"
        className="h-10 w-full rounded-full border border-border bg-surface-2 pl-10 pr-4 text-sm text-chrome placeholder:text-chrome-muted/80 transition duration-150 hover:border-chrome-muted/50 focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand focus-visible:ring-offset-0"
      />
    </form>
  );
}
