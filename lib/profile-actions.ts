"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface CreateProfileData {
  full_name: string
  role?: string
}

export async function createUserProfile(data: CreateProfileData) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to create a profile" }
    }

    console.log("Creating profile for user:", user.id, user.email)

    // Use the server-side function to create the profile
    const { data: result, error: functionError } = await supabase.rpc("create_user_profile", {
      user_id: user.id,
      user_email: user.email!,
      user_full_name: data.full_name || null,
      user_avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      user_role: data.role || "user",
    })

    if (functionError) {
      console.error("Profile creation function error:", functionError)
      return { error: `Failed to create profile: ${functionError.message}` }
    }

    console.log("Profile created successfully:", result)

    // Revalidate pages that depend on profile data
    revalidatePath("/")
    revalidatePath("/add-asset")
    revalidatePath("/profile-setup")

    return { success: true, profile: result }
  } catch (err) {
    console.error("Unexpected error in createUserProfile:", err)
    return { error: "An unexpected error occurred while creating your profile" }
  }
}

export async function checkUserProfile() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in" }
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code === "PGRST116") {
      return { exists: false, user }
    } else if (profileError) {
      return { error: profileError.message }
    }

    return { exists: true, profile, user }
  } catch (err) {
    return { error: "Failed to check profile" }
  }
}
