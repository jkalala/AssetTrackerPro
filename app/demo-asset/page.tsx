import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, MapPin, User, Calendar, QrCode, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DemoAssetPage() {
  const demoAsset = {
    asset_id: "DEMO-001",
    name: 'MacBook Pro 16"',
    description: "High-performance laptop for development work",
    category: "it-equipment",
    status: "active",
    location: "Office A - Desk 12",
    value: 2499.99,
    assignee: { full_name: "John Doe", email: "john.doe@company.com" },
    created_by: { full_name: "Admin User", email: "admin@company.com" },
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    purchase_date: "2024-01-10",
    warranty_expiry: "2027-01-10",
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

  const formatCurrency = (value: number) => {
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
            <Link href="/preview">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Preview
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{demoAsset.name}</h1>
              <p className="text-gray-600">Asset ID: {demoAsset.asset_id}</p>
            </div>
            <Badge className={`${getStatusColor(demoAsset.status)} capitalize`}>{demoAsset.status}</Badge>
          </div>
        </div>

        {/* QR Code Access Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <QrCode className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>QR Code Demo:</strong> This is how an asset page would look when accessed via QR code scan. All
            asset information is instantly available.
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
                    <p className="text-lg font-semibold">{demoAsset.asset_id}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Category</label>
                    <p className="text-lg capitalize">{demoAsset.category}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Badge className={`${getStatusColor(demoAsset.status)} capitalize`}>{demoAsset.status}</Badge>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Value</label>
                    <p className="text-lg font-semibold">{formatCurrency(demoAsset.value)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900">{demoAsset.description}</p>
                </div>
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
                    <p className="text-lg">{demoAsset.location}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Assigned To</label>
                    <p className="text-lg">{demoAsset.assignee.full_name}</p>
                    <p className="text-sm text-gray-600">{demoAsset.assignee.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Purchase Date</label>
                    <p className="text-lg">{formatDate(demoAsset.purchase_date)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Warranty Expiry</label>
                    <p className="text-lg">{formatDate(demoAsset.warranty_expiry)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mx-auto mb-4 border rounded p-4 bg-white" style={{ width: "200px", height: "200px" }}>
                  <QrCode className="w-full h-full text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-4">Scan to access this asset</p>
                <Button variant="outline" className="w-full">
                  Download QR Code
                </Button>
              </CardContent>
            </Card>

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
                  <p className="text-sm">{demoAsset.created_by.full_name}</p>
                  <p className="text-xs text-gray-500">{formatDate(demoAsset.created_at)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-xs text-gray-500">{formatDate(demoAsset.updated_at)}</p>
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

            {/* Demo Features */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Demo Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">Real-time data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">Mobile optimized</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">QR code integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">Instant access</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
