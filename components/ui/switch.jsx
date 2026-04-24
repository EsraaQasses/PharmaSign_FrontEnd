import * as React from "react"
import { Switch as RNSwitch } from "react-native"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <RNSwitch
    trackColor={{ false: "#E5E7EB", true: "#0C6B58" }}
    thumbColor="#FFFFFF"
    ios_backgroundColor="#E5E7EB"
    {...props}
  />
))
Switch.displayName = "Switch"

export { Switch }
