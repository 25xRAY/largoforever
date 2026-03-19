"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const modalSizes = {
  sm: "max-w-[400px]",
  md: "max-w-[500px]",
  lg: "max-w-[700px]",
  xl: "max-w-[900px]",
  full: "max-w-[95vw] max-h-[90vh]",
} as const;

export interface ModalProps extends React.ComponentPropsWithoutRef<typeof Dialog.Root> {
  size?: keyof typeof modalSizes;
}

/**
 * Radix Dialog. Sizes sm(400) to full. Close button, Escape, click-outside, focus trap.
 * Sub-components: ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter.
 */
const Modal = forwardRef<
  React.ComponentRef<typeof Dialog.Content>,
  ModalProps & { children: React.ReactNode }
>(({ size = "md", children, ...props }, ref) => (
  <Dialog.Root {...props}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-900/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-card bg-white p-0 shadow-card-hover focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          modalSizes[size]
        )}
        onEscapeKeyDown={(e) => props.onOpenChange?.(false)}
        onPointerDownOutside={() => props.onOpenChange?.(false)}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
));

Modal.displayName = "Modal";

const ModalHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-start justify-between p-6 pb-0", className)} {...props} />
  )
);
ModalHeader.displayName = "ModalHeader";

const ModalTitle = forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("font-heading text-xl font-semibold", className)}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

const ModalDescription = forwardRef<
  React.ComponentRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description ref={ref} className={cn("mt-1 text-sm text-navy-600", className)} {...props} />
));
ModalDescription.displayName = "ModalDescription";

const ModalContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
  )
);
ModalContent.displayName = "ModalContent";

const ModalFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex justify-end gap-2 p-6 pt-0", className)} {...props} />
  )
);
ModalFooter.displayName = "ModalFooter";

function ModalCloseButton() {
  return (
    <Dialog.Close
      className="rounded p-2 text-navy-500 hover:bg-navy-100 hover:text-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-500"
      aria-label="Close"
    >
      <X className="h-5 w-5" />
    </Dialog.Close>
  );
}

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  Dialog,
  modalSizes,
};
