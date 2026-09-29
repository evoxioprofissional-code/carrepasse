"use client";

import { useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/Input";

type PasswordFieldProps = Omit<ComponentProps<typeof Input>, "type" | "hint">;

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      type={visible ? "text" : "password"}
      hint={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-pressed={visible}
          className="rounded font-medium text-chrome-muted underline-offset-2 hover:text-chrome hover:underline"
        >
          {visible ? "Esconder senha" : "Mostrar senha"}
        </button>
      }
      {...props}
    />
  );
}
