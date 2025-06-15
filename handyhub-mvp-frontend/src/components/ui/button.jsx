import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Slottable } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import CustomLoader from "../CustomLoader/CustomLoader";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90",
        destructive:
          "bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90",
        destructiveOutline:
          "bg-transparent border border-red-500 text-red-500 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90 hover:text-white",
        outline:
          "border border-foundation-primary-white-dark bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
        ghost:
          "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        ghostBlue:
          "hover:bg-primary-blue hover:text-white dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        ghostDestructive:
          "hover:bg-red-500 hover:text-white dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50",

        // Custom Variants
        orange:
          "bg-primary-orange text-neutral-50 hover:bg-primary-orange/90 dark:bg-primary-orange dark:text-neutral-50 dark:hover:bg-primary-orange/90",
        blue: "bg-primary-blue text-neutral-50 hover:bg-primary-blue/90 dark:bg-primary-blue dark:text-neutral-50 dark:hover:bg-primary-blue/90",
        success:
          "bg-green-700 text-neutral-50 hover:bg-green-700/90 dark:bg-success dark:text-neutral-50 dark:hover:bg-success/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        custom: "h-14 px-8 rounded-[112px]",
        auth: "h-11 w-full rounded-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      disabled,
      type,
      loading,
      loadingText = "Loading...",
      loaderColor,
      loaderSize,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        type={type}
        ref={ref}
        {...props}
        disabled={loading || disabled}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-x-2">
            <CustomLoader
              loaderColor={loaderColor}
              size={loaderSize}
              className="mx-auto"
            />

            <span>{loadingText}</span>
          </span>
        ) : (
          <Slottable>{children}</Slottable>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
