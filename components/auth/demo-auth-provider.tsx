"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type DemoUser = {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: string
}

type DemoAuthContextType = {
  user: DemoUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  isDemo: boolean
}

const DemoAuthContext = createContext<DemoAuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
  isDemo: true,
})

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext)
  if (!context) {
    throw new Error("useDemoAuth must be used within a DemoAuthProvider")
  }
  return context
}

// Demo users for testing
const DEMO_USERS = [
  {
    id: "demo-user-1",
    email: "demo@assettracker.com",
    password: "demo123",
    full_name: "Demo User",
    avatar_url: "/placeholder.svg?height=40&width=40",
    role: "admin",
  },
  {
    id: "demo-user-2",
    email: "admin@assettracker.com",
    password: "admin123",
    full_name: "Admin User",
    avatar_url: "/placeholder.svg?height=40&width=40",
    role: "admin",
  },
  {
    id: "demo-user-3",
    email: "user@assettracker.com",
    password: "user123",
    full_name: "Regular User",
    avatar_url: "/placeholder.svg?height=40&width=40",
    role: "user",
  },
]

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem("demo-auth-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("demo-auth-user")
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const demoUser = DEMO_USERS.find((u) => u.email === email && u.password === password)

    if (demoUser) {
      const { password: _, ...userWithoutPassword } = demoUser
      setUser(userWithoutPassword)
      localStorage.setItem("demo-auth-user", JSON.stringify(userWithoutPassword))
      setLoading(false)
      return { success: true }
    } else {
      setLoading(false)
      return { success: false, error: "Invalid email or password" }
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("demo-auth-user")
  }

  return (
    <DemoAuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isDemo: true,
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  )
}
