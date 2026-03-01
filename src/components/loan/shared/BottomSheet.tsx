"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose?: () => void; // omit for non-dismissible sheets
  children: ReactNode;
}

const PANEL_TRANSITION = {
  type: "tween" as const,
  duration: 0.3,
  ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
};

const FADE_TRANSITION = { duration: 0.2 };

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          {onClose ? (
            <motion.button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="fixed inset-0 z-[60] bg-black/85"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FADE_TRANSITION}
            />
          ) : (
            <motion.div
              className="fixed inset-0 z-[60] bg-black/85"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FADE_TRANSITION}
            />
          )}

          {/* Sliding panel */}
          <div className="pointer-events-none fixed inset-0 z-[70] flex flex-col justify-end">
            <motion.div
              className="pointer-events-auto w-full"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={PANEL_TRANSITION}
            >
              <div className="flex flex-col items-center">
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="mb-4 rounded-full bg-[#78716c] p-2 text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
