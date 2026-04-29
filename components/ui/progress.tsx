import * as React from "react"
import { View, Animated } from "react-native"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => {
  return (
    <View
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
      {...props}
    >
      <View
        className="h-full bg-primary flex-1"
        style={{ width: `${value || 0}%` }}
      />
    </View>
  )
})
Progress.displayName = "Progress"

export { Progress }
