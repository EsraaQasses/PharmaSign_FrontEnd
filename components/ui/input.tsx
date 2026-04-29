import * as React from "react"
import { TextInput } from "react-native"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <TextInput
      className={cn(
        "flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900",
        "focus:border-primary focus:ring-1 focus:ring-primary",
        className
      )}
      ref={ref}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
