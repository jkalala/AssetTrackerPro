import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, MapPin, User, Calendar, QrCode, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface AssetPageProps {
  params: {
    assetId: string
  }
}

export default async function AssetPage({ params }: AssetPageProps) {
  const supabase = await createClient()

  const { data: asset, error } = await supabase
    .from("assets")
    .select(`
      *,
      assignee:assignee_id(full_name, email),
      created_by_profile:created_by(full_name, email)
    `)
    .eq("asset_id", params.assetId)
    .single()

  if (error || !asset) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-orange-100 text-orange-800"
      case "retired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (value: number | null) => {
    if (!value) return "Not set"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
              <p className="text-gray-600">Asset ID: {asset.asset_id}</p>
            </div>
            <Badge className={`${getStatusColor(asset.status)} capitalize`}>{asset.status}</Badge>
          </div>
        </div>

        {/* QR Code Access Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <QrCode className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>QR Code Access:</strong> This asset was accessed via QR code scan. All asset information is
            displayed below.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Asset Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Asset Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Asset ID</label>
                    <p className="text-lg font-semibold">{asset.asset_id}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Category</label>
                    <p className="text-lg capitalize">{asset.category}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Badge className={`${getStatusColor(asset.status)} capitalize`}>{asset.status}</Badge>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Value</label>
                    <p className="text-lg font-semibold">{formatCurrency(asset.value)}</p>
                  </div>
                </div>

                {asset.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-gray-900">{asset.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location & Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="text-lg">{asset.location || "Not specified"}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Assigned To</label>
                    <p className="text-lg">{asset.assignee?.full_name || "Unassigned"}</p>
                    {asset.assignee?.email && <p className="text-sm text-gray-600">{asset.assignee.email}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {(asset.purchase_date || asset.warranty_expiry) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {asset.purchase_date && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Purchase Date</label>
                        <p className="text-lg">{formatDate(asset.purchase_date)}</p>
                      </div>
                    )}

                    {asset.warranty_expiry && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Warranty Expiry</label>
                        <p className="text-lg">{formatDate(asset.warranty_expiry)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code Display */}
            {asset.qr_code && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="h-5 w-5 mr-2" />
                    QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <img
                    src={asset.qr_code || "/placeholder.svg"}
                    alt={`QR Code for ${asset.name}`}
                    className="mx-auto mb-4 border rounded"
                    style={{ maxWidth: "200px" }}
                  />
                  <Button variant="outline" className="w-full">
                    Download QR Code
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Asset Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Asset History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Created By</label>
                  <p className="text-sm">{asset.created_by_profile?.full_name || "Unknown"}</p>
                  <p className="text-xs text-gray-500">{formatDate(asset.created_at)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-xs text-gray-500">{formatDate(asset.updated_at)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full">
                  Report Issue
                </Button>
                <Button variant="outline" className="w-full">
                  Request Maintenance
                </Button>
                <Button variant="outline" className="w-full">
                  Transfer Asset
                </Button>
                <Button variant="outline" className="w-full">
                  View Full History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
