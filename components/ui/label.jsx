import * as React from "react"
import { Text } from "react-native"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none",
  {
    variants: {},
    defaultVariants: {},
  }
)

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
