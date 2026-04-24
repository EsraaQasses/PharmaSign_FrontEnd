import * as React from "react"
import { TextInput } from "react-native"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <TextInput
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900",
        "focus:border-primary focus:ring-1 focus:ring-primary",
        className
      )}
      ref={ref}
      multiline
      textAlignVertical="top"
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
