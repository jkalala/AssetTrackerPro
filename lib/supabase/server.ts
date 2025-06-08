import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // In preview/demo mode, return a mock client
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not found. Running in demo mode.")

    // Return a mock client for preview environments
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        exchangeCodeForSession: () => Promise.resolve({ data: null, error: { message: "Demo mode" } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: "DEMO_MODE" } }),
          }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        insert: () => Promise.resolve({ data: null, error: { message: "Demo mode - no database operations" } }),
        update: () => Promise.resolve({ data: null, error: { message: "Demo mode - no database operations" } }),
        delete: () => Promise.resolve({ data: null, error: { message: "Demo mode - no database operations" } }),
      }),
    } as any
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
