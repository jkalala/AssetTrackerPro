import QRCode from "qrcode"

export interface QRCodeOptions {
  size?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
}

export interface AssetQRData {
  assetId: string
  name: string
  category: string
  url: string
}

export class QRCodeGenerator {
  private static defaultOptions: QRCodeOptions = {
    size: 200,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "M",
  }

  static async generateAssetQR(assetData: AssetQRData, options: QRCodeOptions = {}): Promise<string> {
    const qrOptions = { ...this.defaultOptions, ...options }

    // Create QR data with asset information
    const qrData = JSON.stringify({
      type: "asset",
      id: assetData.assetId,
      name: assetData.name,
      category: assetData.category,
      url: assetData.url,
      timestamp: new Date().toISOString(),
    })

    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: qrOptions.size,
        margin: qrOptions.margin,
        color: qrOptions.color,
        errorCorrectionLevel: qrOptions.errorCorrectionLevel,
      })

      return qrCodeDataURL
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`)
    }
  }

  static async generateBulkQRCodes(
    assets: AssetQRData[],
    options: QRCodeOptions = {},
  ): Promise<{ assetId: string; qrCode: string; success: boolean; error?: string }[]> {
    const results = await Promise.allSettled(
      assets.map(async (asset) => ({
        assetId: asset.assetId,
        qrCode: await this.generateAssetQR(asset, options),
        success: true,
      })),
    )

    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      } else {
        return {
          assetId: assets[index].assetId,
          qrCode: "",
          success: false,
          error: result.reason.message,
        }
      }
    })
  }

  static parseQRData(qrString: string): AssetQRData | null {
    try {
      const data = JSON.parse(qrString)
      if (data.type === "asset" && data.id && data.name) {
        return {
          assetId: data.id,
          name: data.name,
          category: data.category || "unknown",
          url: data.url || "",
        }
      }
      return null
    } catch {
      return null
    }
  }
}
