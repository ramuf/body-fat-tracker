"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { auth } from "@/lib/api"
import { User } from "@/types"

export function ProfileDialog() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && !user) {
      setLoading(true)
      auth.me()
        .then((response) => setUser(response.data))
        .catch((error) => console.error("Failed to fetch user", error))
        .finally(() => setLoading(false))
    }
  }, [open, user])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-4">Loading...</div>
        ) : user ? (
          <ProfileForm user={user} onSuccess={() => setOpen(false)} />
        ) : (
          <div className="text-center py-4 text-destructive">Failed to load user profile.</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
