import * as React from "react"
import { View, Text } from "react-native"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary",
        secondary:
          "border-transparent bg-secondary",
        destructive:
          "border-transparent bg-red-500",
        outline: "border-gray-200 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const badgeTextVariants = cva(
  "text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "text-white",
        secondary: "text-white",
        destructive: "text-white",
        outline: "text-gray-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, textClassName, variant, children, ...props }) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      <Text className={cn(badgeTextVariants({ variant }), textClassName)}>
        {children}
      </Text>
    </View>
  )
}

export { Badge, badgeVariants }
