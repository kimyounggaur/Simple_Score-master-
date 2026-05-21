import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-9 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
  {
    variants: {
      variant: {
        default: "border-slate-900 bg-slate-900 text-white hover:bg-slate-700",
        secondary: "border-slate-200 bg-white text-slate-900 hover:bg-slate-100",
        ghost: "border-transparent bg-transparent text-slate-700 hover:bg-slate-100",
        destructive: "border-red-600 bg-red-600 text-white hover:bg-red-700",
        accent: "border-teal-600 bg-teal-600 text-white hover:bg-teal-700"
      },
      size: {
        default: "px-3",
        icon: "h-9 w-9 p-0",
        sm: "h-8 px-2 text-xs",
        lg: "h-10 px-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { buttonVariants };
