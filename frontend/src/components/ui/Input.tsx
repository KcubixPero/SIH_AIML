import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

const inputVariants = cva(
  "h-9 w-full border border-border rounded-md px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus:border-primary disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        filled: "bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type = "text", ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };