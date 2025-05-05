import * as React from "react"
import { cn } from "../../lib/utils"

export const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-accent2", className)}
      {...props}
    />
  )
)
Skeleton.displayName = "Skeleton"
