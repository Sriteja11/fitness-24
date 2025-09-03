import { createPortal } from "react-dom";
import { useEffect } from "react";

// Simple Modal wrapper with backdrop and ESC close
export function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white/90 dark:bg-slate-800/90 rounded-3xl p-8 shadow-2xl border border-slate-200/60 dark:border-slate-700/60"
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}
