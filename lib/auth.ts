'use client'

import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

export interface AuthUser {
  id: string
  email: string
  user_type: 'customer' | 'admin' | 'staff'
  is_verified: boolean
}

/**
 * Sign up a new user
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  userType: 'customer' | 'admin' = 'customer'
) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        full_name: fullName,
        user_type: userType,
      },
    },
  })

  return { data, error }
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  return {
    id: user.id,
    email: user.email || '',
    user_type: (user.user_metadata?.user_type || 'customer') as AuthUser['user_type'],
    is_verified: user.email_confirmed_at !== null,
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.user_type === 'admin'
}

/**
 * Get user session
 */
export async function getSession() {
  const supabase = createServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

/**
 * Refresh auth token
 */
export async function refreshAuth() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.refreshSession()
  return { data, error }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  return { data, error }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  return { data, error }
}
