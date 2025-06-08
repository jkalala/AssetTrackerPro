"use server"

import { createClient } from "@/lib/supabase/server"
import { QRCodeGenerator } from "./qr-code-utils"
import { revalidatePath } from "next/cache"

export async function generateAssetQRCode(assetId: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: "You must be logged in to generate QR codes" }
    }

    // Get asset data
    const { data: asset, error: assetError } = await supabase
      .from("assets")
      .select("*")
      .eq("asset_id", assetId)
      .single()

    if (assetError || !asset) {
      return { error: "Asset not found" }
    }

    // Generate QR code
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const assetUrl = `${baseUrl}/asset/${asset.asset_id}`

    const qrCodeDataURL = await QRCodeGenerator.generateAssetQR({
      assetId: asset.asset_id,
      name: asset.name,
      category: asset.category,
      url: assetUrl,
    })

    // Update asset with QR code
    const { error: updateError } = await supabase.from("assets").update({ qr_code: qrCodeDataURL }).eq("id", asset.id)

    if (updateError) {
      return { error: "Failed to save QR code to asset" }
    }

    revalidatePath("/")
    return { success: true, qrCode: qrCodeDataURL, assetUrl }
  } catch (error) {
    console.error("QR generation error:", error)
    return { error: "Failed to generate QR code" }
  }
}

export async function generateBulkQRCodes(assetIds: string[]) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: "You must be logged in to generate QR codes" }
    }

    // Get assets data
    const { data: assets, error: assetsError } = await supabase.from("assets").select("*").in("asset_id", assetIds)

    if (assetsError || !assets) {
      return { error: "Failed to fetch assets" }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Generate QR codes for all assets
    const assetQRData = assets.map((asset) => ({
      assetId: asset.asset_id,
      name: asset.name,
      category: asset.category,
      url: `${baseUrl}/asset/${asset.asset_id}`,
    }))

    const qrResults = await QRCodeGenerator.generateBulkQRCodes(assetQRData)

    // Update assets with QR codes
    const updatePromises = qrResults
      .filter((result) => result.success)
      .map((result) => {
        const asset = assets.find((a) => a.asset_id === result.assetId)
        if (asset) {
          return supabase.from("assets").update({ qr_code: result.qrCode }).eq("id", asset.id)
        }
        return null
      })
      .filter(Boolean)

    await Promise.all(updatePromises)

    revalidatePath("/")
    return { success: true, results: qrResults }
  } catch (error) {
    console.error("Bulk QR generation error:", error)
    return { error: "Failed to generate QR codes" }
  }
}

export async function lookupAssetByQR(qrData: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: "You must be logged in to lookup assets" }
    }

    // Parse QR data
    const assetData = QRCodeGenerator.parseQRData(qrData)
    if (!assetData) {
      return { error: "Invalid QR code format" }
    }

    // Look up asset
    const { data: asset, error: assetError } = await supabase
      .from("assets")
      .select(`
        *,
        assignee:assignee_id(full_name),
        created_by_profile:created_by(full_name)
      `)
      .eq("asset_id", assetData.assetId)
      .single()

    if (assetError || !asset) {
      return { error: "Asset not found in database" }
    }

    return { success: true, asset, qrData: assetData }
  } catch (error) {
    console.error("QR lookup error:", error)
    return { error: "Failed to lookup asset" }
  }
}
