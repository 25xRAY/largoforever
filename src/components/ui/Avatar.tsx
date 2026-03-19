"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { forwardRef } from "react";
import { cn, getInitials } from "@/lib/utils";

const avatarSizes = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-xl",
} as const;

export interface AvatarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>, "children"> {
  size?: keyof typeof avatarSizes;
  name?: string;
  image?: string | null;
  showRing?: boolean;
}

/**
 * Radix Avatar. Sizes xs(24) to xl(80). Fallback shows initials from name. Optional border ring.
 */
const Avatar = forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = "md", name, image, showRing = false, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex shrink-0 overflow-hidden rounded-full",
      avatarSizes[size],
      showRing && "ring-2 ring-gold-500 ring-offset-2",
      className
    )}
    aria-label={name ? `Avatar for ${name}` : undefined}
    {...props}
  >
    <AvatarPrimitive.Image
      src={image ?? undefined}
      className="aspect-square h-full w-full object-cover"
      alt={name ?? ""}
    />
    <AvatarPrimitive.Fallback
      className="flex h-full w-full items-center justify-center bg-navy-200 font-heading font-semibold text-navy-700"
      delayMs={0}
    >
      {name ? getInitials(name) : "?"}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
));

Avatar.displayName = AvatarPrimitive.Root.displayName ?? "Avatar";

export { Avatar, avatarSizes };
