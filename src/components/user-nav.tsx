"use client"

import { UserButton } from "@clerk/nextjs"
import { User } from "lucide-react"

export function UserNav() {
  return (
    <UserButton 
      appearance={{
        elements: {
          userButtonAvatarBox: "h-8 w-8", // Make it consistent with other buttons
          userButtonPopoverCard: "bg-card border border-border shadow-md",
          userButtonPopoverActionButton: "text-foreground hover:bg-accent",
          userButtonPopoverActionButtonText: "text-foreground",
          userButtonPopoverActionButtonIcon: "text-muted-foreground",
        }
      }}
      userProfileMode="navigation"
      userProfileUrl="/user-profile"
      afterSignOutUrl="/"
    >
      <UserButton.MenuItems>
        <UserButton.Action label="manageAccount" />
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  )
} 