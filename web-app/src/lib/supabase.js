import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-supabase.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Helper to check if current user is signed in
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
  } catch (err) {
    return null
  }
}

/**
 * Fetch profile data for current user
 */
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) return null
    return data
  } catch {
    return null
  }
}

/**
 * Check active subscription for a user
 */
export async function getUserActiveSubscription(userId) {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      
    if (error || !data) return null
    return data
  } catch {
    return null
  }
}

/**
 * Get system setting by key with default fallback
 */
export async function getSystemSetting(key, defaultValue = null) {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .single()
    if (error || !data) return defaultValue
    return data.value
  } catch {
    return defaultValue
  }
}
