import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
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
        signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: null }),
        signUp: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
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

  // Create a singleton client to prevent multiple instances
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}
