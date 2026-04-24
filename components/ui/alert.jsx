import * as React from "react"
import { View, Text } from "react-native"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 flex-row items-start gap-3",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900 border-gray-200",
        destructive:
          "border-red-500/50 bg-red-50 text-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, children, icon: Icon, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(alertVariants({ variant }), className)}
    {...props}
  >
    {Icon && (
      <View className="mt-0.5">
        <Icon size={20} color={variant === 'destructive' ? '#EF4444' : '#0C6B58'} />
      </View>
    )}
    <View className="flex-1">{children}</View>
  </View>
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn("mb-1 font-bold leading-none tracking-tight text-base", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
