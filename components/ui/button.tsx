import * as React from "react"
import { TouchableOpacity, Text } from "react-native"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-xl",
  {
    variants: {
      variant: {
        default: "bg-primary",
        destructive: "bg-red-500",
        outline: "border border-gray-200 bg-transparent",
        secondary: "bg-secondary",
        ghost: "bg-transparent",
        link: "bg-transparent",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4",
        lg: "h-14 px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const textVariants = cva(
  "font-bold text-center",
  {
    variants: {
      variant: {
        default: "text-white",
        destructive: "text-white",
        outline: "text-gray-900",
        secondary: "text-white",
        ghost: "text-gray-900",
        link: "text-primary underline",
      },
      size: {
        default: "text-base",
        sm: "text-sm",
        lg: "text-lg",
        icon: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, children, textClassName, ...props }, ref) => {
  return (
    <TouchableOpacity
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      activeOpacity={0.8}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={cn(textVariants({ variant, size, className: textClassName }))}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
})
Button.displayName = "Button"

export { Button, buttonVariants, textVariants }
