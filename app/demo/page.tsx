"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Scan, Plus, Download, Upload } from "lucide-react"

export default function DemoPage() {
  const [selectedAsset, setSelectedAsset] = useState<string>("")
  const [qrGenerated, setQrGenerated] = useState(false)
  const [scanResult, setScanResult] = useState<string>("")

  const mockAssets = [
    { id: "1", name: "Laptop Dell XPS 13", serial: "DL001", status: "Active" },
    { id: "2", name: "iPhone 14 Pro", serial: "IP002", status: "Active" },
    { id: "3", name: "Office Chair", serial: "OC003", status: "Maintenance" },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Asset Management System Demo</h1>
        <p className="text-muted-foreground">Interactive preview of QR code functionality and asset management</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="generate">Generate QR</TabsTrigger>
          <TabsTrigger value="scan">Scan QR</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">QR Codes Generated</CardTitle>
                <Scan className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">856</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground">+23% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Assets</CardTitle>
              <CardDescription>Your latest asset additions with QR integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">Serial: {asset.serial}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={asset.status === "Active" ? "default" : "secondary"}>{asset.status}</Badge>
                      <Button size="sm" variant="outline">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate QR Code</CardTitle>
              <CardDescription>Create QR codes for your assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asset-select">Select Asset</Label>
                <select
                  id="asset-select"
                  className="w-full p-2 border rounded-md"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                >
                  <option value="">Choose an asset...</option>
                  {mockAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} - {asset.serial}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setQrGenerated(true)} disabled={!selectedAsset} className="flex-1">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </Button>
                <Button variant="outline" disabled={!qrGenerated}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              {qrGenerated && selectedAsset && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="text-center space-y-2">
                    <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 mx-auto flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium">QR Code Generated!</p>
                    <p className="text-xs text-muted-foreground">
                      Asset: {mockAssets.find((a) => a.id === selectedAsset)?.name}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>Scan QR codes to access asset information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Scan Method</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Scan className="h-4 w-4 mr-2" />
                    Use Camera
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setScanResult("Laptop Dell XPS 13 - DL001")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <Scan className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Camera preview would appear here</p>
                <p className="text-xs text-muted-foreground mt-1">Click "Upload Image" to simulate a scan</p>
              </div>

              {scanResult && (
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="space-y-2">
                    <p className="font-medium text-green-800">Scan Successful!</p>
                    <p className="text-sm text-green-700">Asset Found: {scanResult}</p>
                    <Button size="sm" className="mt-2">
                      View Asset Details
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk QR Operations</CardTitle>
              <CardDescription>Generate QR codes for multiple assets at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Assets for Bulk Generation</Label>
                <div className="space-y-2">
                  {mockAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center space-x-2">
                      <input type="checkbox" id={asset.id} className="rounded" />
                      <label htmlFor={asset.id} className="text-sm">
                        {asset.name} - {asset.serial}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate All QR Codes
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download ZIP
                </Button>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> You can also import assets from CSV and generate QR codes in bulk!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
