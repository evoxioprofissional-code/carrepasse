"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  /** "sheet" abre de baixo para cima (drawer mobile). */
  variant?: "center" | "sheet";
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * Modal sobre o <dialog> nativo: foco preso, Esc fecha e o resto
 * da página fica inerte sem precisar de biblioteca.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  variant = "center",
  footer,
  className,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Trava a rolagem da página enquanto o modal está aberto.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // Clique no fundo escurecido (fora do conteúdo) fecha.
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "max-h-none max-w-none bg-transparent p-0 text-chrome backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        variant === "center" && "m-auto w-[calc(100%-2rem)] max-w-lg open:animate-fade-in",
        variant === "sheet" && "mb-0 mt-auto w-full open:animate-sheet-in",
      )}
    >
      <div
        className={cn(
          "flex flex-col border border-border bg-surface",
          variant === "center" && "max-h-[85dvh] rounded-xl",
          variant === "sheet" && "max-h-[85dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)]",
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border p-4">
          <div>
            <h2 id={titleId} className="text-lg text-chrome">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-chrome-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-m-2.5 rounded-lg p-2.5 text-chrome-muted transition duration-150 hover:bg-surface-2 hover:text-chrome"
          >
            <X aria-hidden className="size-5" />
          </button>
        </header>
        <div className="overflow-y-auto p-4">{children}</div>
        {footer && (
          <footer className="flex flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:justify-end">
            {footer}
          </footer>
        )}
      </div>
    </dialog>
  );
}
