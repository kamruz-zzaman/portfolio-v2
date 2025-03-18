"use client"

import type React from "react"

import { createContext } from "react"

// This provider is no longer needed as we're using NextAuth
// Keeping it as a stub to avoid breaking existing imports
interface User {
  id: string
  name: string | null
  email: string
  image: string | null
}

interface AuthContextType {
  user: User | null
  signIn: (user: User) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useAuth() {
  // Return a stub that won't break existing code
  return {
    user: null,
    signIn: async () => {},
    signOut: async () => {},
  }
}

