import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const error_description = searchParams.get("error_description")
  const provider = searchParams.get("provider")

  console.log("Auth callback received:", { code: !!code, error, provider })

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/"

  // Handle error cases
  if (error) {
    console.error("Auth callback error:", error, error_description)
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent(error_description || error)}`,
    )
  }

  // Check if we're in demo mode (no Supabase env vars)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("Demo mode: redirecting to demo dashboard")
    return NextResponse.redirect(`${origin}/demo`)
  }

  if (code) {
    try {
      const supabase = await createClient()

      console.log("Exchanging code for session...")
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("Code exchange error:", exchangeError)
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(exchangeError.message)}`,
        )
      }

      console.log("Session created successfully, user:", data.user?.id)

      if (data.user) {
        // Check if user profile exists, create if not
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .single()

        if (profileError && profileError.code === "PGRST116") {
          console.log("Creating new profile for user:", data.user.id)
          // Profile doesn't exist, create it
          // Handle different auth providers
          let fullName = null
          let avatarUrl = null

          if (data.user.app_metadata?.provider === "github") {
            fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || null
            avatarUrl = data.user.user_metadata?.avatar_url || null
            console.log("GitHub user metadata:", data.user.user_metadata)
          } else if (data.user.app_metadata?.provider === "google") {
            fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || null
            avatarUrl = data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null
          } else {
            // Email signup
            fullName = data.user.user_metadata?.full_name || null
          }

          const { error: insertError } = await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            avatar_url: avatarUrl,
            role: "user",
          })

          if (insertError) {
            console.error("Profile creation error:", insertError)
          } else {
            console.log("Profile created successfully")
          }
        } else {
          console.log("User profile already exists")
        }

        // Successful authentication
        const forwardedHost = request.headers.get("x-forwarded-host")
        const isLocalEnv = process.env.NODE_ENV === "development"

        console.log("Redirecting to:", next)
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`)
        } else {
          return NextResponse.redirect(`${origin}${next}`)
        }
      }
    } catch (err) {
      console.error("Unexpected auth callback error:", err)
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=${encodeURIComponent("Authentication failed")}`,
      )
    }
  }

  // No code provided
  return NextResponse.redirect(
    `${origin}/auth/auth-code-error?error=${encodeURIComponent("No authentication code provided")}`,
  )
}
