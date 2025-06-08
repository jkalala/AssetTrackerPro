"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, X, Scan, AlertTriangle, CheckCircle } from "lucide-react"
import { lookupAssetByQR } from "@/lib/qr-actions"

interface QRScannerProps {
  onScanSuccess?: (assetData: any) => void
  onScanError?: (error: string) => void
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isScanning, setIsScanning] = useState(false)
  const [hasCamera, setHasCamera] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [scanResult, setScanResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkCameraAvailability()
    return () => {
      stopCamera()
    }
  }, [])

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")
      setHasCamera(videoDevices.length > 0)
    } catch (err) {
      setHasCamera(false)
    }
  }

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera if available
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }

      setStream(mediaStream)
      setIsScanning(true)

      // Start scanning loop
      scanQRCode()
    } catch (err) {
      setError("Failed to access camera. Please check permissions.")
      setIsScanning(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }

  const scanQRCode = async () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      setTimeout(scanQRCode, 100)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    try {
      // In a real implementation, you would use a QR code library like jsQR
      // For this demo, we'll simulate QR detection
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // Simulate QR code detection (replace with actual QR library)
      // const code = jsQR(imageData.data, imageData.width, imageData.height)

      // For demo purposes, we'll check if user clicks to simulate scan
      setTimeout(scanQRCode, 100)
    } catch (err) {
      setTimeout(scanQRCode, 100)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      // Create image element to load the file
      const img = new Image()
      const canvas = canvasRef.current

      if (!canvas) {
        throw new Error("Canvas not available")
      }

      img.onload = async () => {
        const context = canvas.getContext("2d")
        if (!context) return

        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0)

        // In a real implementation, use jsQR or similar library
        // const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        // const code = jsQR(imageData.data, imageData.width, imageData.height)

        // For demo, simulate successful scan with sample data
        const sampleQRData = JSON.stringify({
          type: "asset",
          id: "DEMO-001",
          name: "Sample Asset",
          category: "it-equipment",
          url: "http://localhost:3000/asset/DEMO-001",
        })

        await processQRData(sampleQRData)
      }

      img.src = URL.createObjectURL(file)
    } catch (err) {
      setError("Failed to process uploaded image")
      setLoading(false)
    }
  }

  const processQRData = async (qrData: string) => {
    setLoading(true)
    try {
      const result = await lookupAssetByQR(qrData)

      if (result.error) {
        setError(result.error)
        onScanError?.(result.error)
      } else {
        setScanResult(result)
        onScanSuccess?.(result)
      }
    } catch (err) {
      const errorMsg = "Failed to lookup asset"
      setError(errorMsg)
      onScanError?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const simulateSuccessfulScan = async () => {
    // Demo function to simulate a successful QR scan
    const sampleQRData = JSON.stringify({
      type: "asset",
      id: "AST-001",
      name: 'MacBook Pro 16"',
      category: "it-equipment",
      url: "http://localhost:3000/asset/AST-001",
    })

    await processQRData(sampleQRData)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scan className="h-5 w-5 mr-2" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>Scan QR codes to quickly access asset information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {scanResult && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Asset Found:</strong> {scanResult.asset?.name} ({scanResult.asset?.asset_id})
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Camera Scanner */}
            <div className="space-y-3">
              <h4 className="font-medium">Camera Scanner</h4>
              {hasCamera ? (
                <div className="space-y-3">
                  {!isScanning ? (
                    <Button onClick={startCamera} className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  ) : (
                    <Button onClick={stopCamera} variant="outline" className="w-full">
                      <X className="h-4 w-4 mr-2" />
                      Stop Camera
                    </Button>
                  )}

                  <div className="relative">
                    <video
                      ref={videoRef}
                      className={`w-full rounded-lg border ${isScanning ? "block" : "hidden"}`}
                      style={{ maxHeight: "300px" }}
                    />
                    {isScanning && (
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-blue-500 rounded-lg"></div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>Camera not available or permission denied</AlertDescription>
                </Alert>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <h4 className="font-medium">Upload QR Image</h4>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {loading ? "Processing..." : "Upload QR Image"}
              </Button>

              <div className="text-center">
                <Button onClick={simulateSuccessfulScan} variant="outline" size="sm" className="text-xs">
                  Demo: Simulate Scan
                </Button>
              </div>
            </div>
          </div>

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Scan Result Display */}
          {scanResult && scanResult.asset && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Asset Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>Asset ID:</strong>
                  </div>
                  <div>{scanResult.asset.asset_id}</div>

                  <div>
                    <strong>Name:</strong>
                  </div>
                  <div>{scanResult.asset.name}</div>

                  <div>
                    <strong>Category:</strong>
                  </div>
                  <div className="capitalize">{scanResult.asset.category}</div>

                  <div>
                    <strong>Status:</strong>
                  </div>
                  <div className="capitalize">{scanResult.asset.status}</div>

                  <div>
                    <strong>Location:</strong>
                  </div>
                  <div>{scanResult.asset.location || "Not set"}</div>

                  <div>
                    <strong>Assignee:</strong>
                  </div>
                  <div>{scanResult.asset.assignee?.full_name || "Unassigned"}</div>
                </div>

                <Button className="w-full mt-4">View Full Asset Details</Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
