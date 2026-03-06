// hooks/useAdminAuth.js
// Simple session-based auth check for the admin panel.
// In production: replace with NextAuth, Clerk, or JWT verification.

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'linaroos-admin-2024'

export function useAdminAuth() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('lr-admin-token')
    if (token === ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      router.replace('/admin/login')
    }
    setChecking(false)
  }, [])

  const logout = () => {
    sessionStorage.removeItem('lr-admin-token')
    router.push('/admin/login')
  }

  return { authed, checking, logout }
}

export function adminLogin(password) {
  const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'linaroos-admin-2024'
  if (password === correct) {
    sessionStorage.setItem('lr-admin-token', password)
    return true
  }
  return false
}
