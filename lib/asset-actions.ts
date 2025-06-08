"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface AddAssetData {
  asset_id: string
  name: string
  description: string | null
  category: string
  status: string
  location: string | null
  value: number | null
}

export async function addAsset(data: AddAssetData) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to add assets" }
    }

    console.log("Current user:", user.id, user.email)

    // Check if user profile exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single()

    if (profileCheckError && profileCheckError.code === "PGRST116") {
      return {
        error:
          "Your user profile is missing. Please complete your profile setup first before adding assets. Refresh the page and create your profile using the setup form above.",
      }
    } else if (profileCheckError) {
      console.error("Profile check error:", profileCheckError)
      return { error: `Profile verification failed: ${profileCheckError.message}` }
    }

    // Check if asset_id already exists
    const { data: existingAsset } = await supabase
      .from("assets")
      .select("asset_id")
      .eq("asset_id", data.asset_id)
      .single()

    if (existingAsset) {
      return { error: `Asset ID "${data.asset_id}" already exists. Please use a unique Asset ID.` }
    }

    // Insert the asset
    const { error: insertError } = await supabase.from("assets").insert({
      ...data,
      created_by: user.id,
    })

    if (insertError) {
      console.error("Asset insert error:", insertError)
      return { error: `Failed to create asset: ${insertError.message}` }
    }

    // Revalidate the home page to show the new asset
    revalidatePath("/")

    return { success: true }
  } catch (err) {
    console.error("Unexpected error in addAsset:", err)
    return { error: "An unexpected error occurred while creating the asset" }
  }
}
