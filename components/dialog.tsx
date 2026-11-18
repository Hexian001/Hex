"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

export function Dialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="ticks p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-serif text-4xl leading-none text-ink">
            {title}
          </h2>
          <button type="button" className="btn btn-ghost min-h-10 px-3" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </dialog>
  );
}
