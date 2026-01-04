"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: "linear-gradient(135deg,#ffffff,#f3f4f6)" }} />
            <span>Light</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: "linear-gradient(135deg,#071426,#0b1220)" }} />
            <span>Dark</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("neon")}> 
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: "linear-gradient(135deg,#ff66c4,#4cc9f0)" }} />
            <span>Neon</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("nocturne")}>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: "linear-gradient(135deg,#022228,#001a1e)" }} />
            <span>Nocturne</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("northern-lights")}>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: "linear-gradient(135deg,#57f287,#a855f7)" }} />
            <span>Northern Lights</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("sunrise")}> 
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full shadow-inner"
              style={{ background: "linear-gradient(135deg,#ff6b6b,#ffb86b)" }}
            />
            <span>Sunrise Bloom</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
