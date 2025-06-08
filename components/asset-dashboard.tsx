"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  QrCode,
  Shield,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Search,
  Plus,
  Scan,
  Download,
  Eye,
  Edit,
  Trash2,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { signOut } from "@/lib/auth-actions"
import Image from "next/image"
import QRGenerator from "./qr-generator"
import QRScanner from "./qr-scanner"
import BulkQROperations from "./bulk-qr-operations"

interface Profile {
  id: string
  full_name: string | null
  role: string
  email: string
  avatar_url?: string | null
}

interface Asset {
  id: string
  asset_id: string
  name: string
  category: string
  status: string
  location: string | null
  value: number | null
  assignee?: { full_name: string } | null
  created_at: string
  updated_at: string
  qr_code?: string | null
}

interface AssetDashboardProps {
  user: User
  profile: Profile | null
  assets: Asset[]
}

export default function AssetDashboard({ user, profile, assets }: AssetDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
    router.refresh()
  }

  const handleAddAsset = () => {
    router.push("/add-asset")
  }

  // Calculate analytics from real data
  const analytics = {
    totalAssets: assets.length,
    activeAssets: assets.filter((asset) => asset.status === "active").length,
    maintenanceAssets: assets.filter((asset) => asset.status === "maintenance").length,
    retiredAssets: assets.filter((asset) => asset.status === "retired").length,
    totalValue: assets.reduce((sum, asset) => sum + (asset.value || 0), 0),
    utilizationRate:
      assets.length > 0
        ? Math.round((assets.filter((asset) => asset.status === "active").length / assets.length) * 100)
        : 0,
    maintenanceAlerts: assets.filter((asset) => asset.status === "maintenance").length,
  }

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.asset_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "maintenance":
        return "destructive"
      case "retired":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    }
    return user.email?.[0].toUpperCase() || "U"
  }

  const UserAvatar = () => {
    if (profile?.avatar_url) {
      return (
        <Image
          src={profile.avatar_url || "/placeholder.svg"}
          alt={profile.full_name || "User avatar"}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
      )
    }

    return (
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
        {getUserInitials()}
      </div>
    )
  }

  const TeamUserAvatar = () => {
    if (profile?.avatar_url) {
      return (
        <Image
          src={profile.avatar_url || "/placeholder.svg"}
          alt={profile.full_name || "User avatar"}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
      )
    }

    return (
      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
        {getUserInitials()}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AssetTracker Pro</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
            <div className="flex items-center space-x-2">
              <UserAvatar />
              <span className="text-sm font-medium">{profile?.full_name || user.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "assets" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("assets")}
            >
              <Package className="h-4 w-4 mr-2" />
              Asset Management
            </Button>
            <Button
              variant={activeTab === "qr" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("qr")}
            >
              <QrCode className="h-4 w-4 mr-2" />
              QR Code Tools
            </Button>
            <Button
              variant={activeTab === "team" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("team")}
            >
              <Users className="h-4 w-4 mr-2" />
              Team Collaboration
            </Button>
            <Button
              variant={activeTab === "security" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("security")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Security
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button onClick={handleAddAsset}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Asset
                  </Button>
                </div>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalAssets.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.totalAssets > 0 ? (
                        <span className="text-green-600">Active system</span>
                      ) : (
                        <span className="text-gray-500">No assets yet</span>
                      )}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(analytics.totalValue)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-blue-600">Asset portfolio value</span>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.utilizationRate}%</div>
                    <Progress value={analytics.utilizationRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Maintenance Alerts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{analytics.maintenanceAlerts}</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.maintenanceAlerts > 0 ? "Requires attention" : "All systems operational"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Asset Status Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Status Distribution</CardTitle>
                    <CardDescription>Current status of all assets</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Active</span>
                      </div>
                      <span className="font-semibold">{analytics.activeAssets}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>Maintenance</span>
                      </div>
                      <span className="font-semibold">{analytics.maintenanceAssets}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span>Retired</span>
                      </div>
                      <span className="font-semibold">{analytics.retiredAssets}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Assets</CardTitle>
                    <CardDescription>Latest asset additions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {assets.slice(0, 3).map((asset) => (
                      <div key={asset.id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">Added {formatDate(asset.created_at)}</p>
                        </div>
                      </div>
                    ))}
                    {assets.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">
                          No assets yet. Add your first asset to get started!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "assets" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Asset Management</h2>
                <Button onClick={handleAddAsset}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Asset
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">Filter</Button>
                <Button variant="outline">
                  <Scan className="h-4 w-4 mr-2" />
                  Scan QR
                </Button>
              </div>

              {/* Assets Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Assets ({filteredAssets.length})</CardTitle>
                  <CardDescription>Manage and track all your assets</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredAssets.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Asset ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Assignee</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAssets.map((asset) => (
                          <TableRow key={asset.id}>
                            <TableCell className="font-medium">{asset.asset_id}</TableCell>
                            <TableCell>{asset.name}</TableCell>
                            <TableCell className="capitalize">{asset.category}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(asset.status)} className="capitalize">
                                {asset.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{asset.location || "Not set"}</TableCell>
                            <TableCell>{asset.assignee?.full_name || "Unassigned"}</TableCell>
                            <TableCell>{asset.value ? formatCurrency(asset.value) : "Not set"}</TableCell>
                            <TableCell>{formatDate(asset.created_at)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <QrCode className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first asset"}
                      </p>
                      <Button onClick={handleAddAsset}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Asset
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "qr" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">QR Code Tools</h2>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export QR Report
                </Button>
              </div>

              {/* QR Code Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <QrCode className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total QR Codes</p>
                        <p className="text-2xl font-bold">{assets.filter((a) => a.qr_code).length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <Package className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Assets with QR</p>
                        <p className="text-2xl font-bold">
                          {Math.round((assets.filter((a) => a.qr_code).length / Math.max(assets.length, 1)) * 100)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Missing QR</p>
                        <p className="text-2xl font-bold">{assets.filter((a) => !a.qr_code).length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <Scan className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Scans Today</p>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* QR Generator */}
                <QRGenerator assets={assets} />

                {/* QR Scanner */}
                <QRScanner
                  onScanSuccess={(data) => {
                    console.log("Scan successful:", data)
                    // Handle successful scan
                  }}
                  onScanError={(error) => {
                    console.error("Scan error:", error)
                    // Handle scan error
                  }}
                />
              </div>

              {/* Bulk Operations */}
              <BulkQROperations assets={assets} />
            </div>
          )}

          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Team Collaboration</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage team access and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <TeamUserAvatar />
                          <div>
                            <p className="font-medium">{profile?.full_name || "You"}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="default">Active</Badge>
                          <Badge variant="outline" className="capitalize">
                            {profile?.role || "User"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Invite team members</h3>
                        <p className="text-gray-500 mb-4">Start collaborating by inviting your team members</p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Send Invitation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Team member actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm">You joined the team</p>
                          <p className="text-xs text-gray-500">Welcome!</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Security Settings</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Access Control
                    </CardTitle>
                    <CardDescription>Manage user permissions and access levels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Email Authentication</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>GitHub OAuth</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Google OAuth</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Row Level Security</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Role-Based Access</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Session Management</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>
                    <Button className="w-full">Configure Access Settings</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Protection</CardTitle>
                    <CardDescription>Enterprise-grade security measures</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Data Encryption</span>
                        <Badge variant="default">AES-256</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Backup Encryption</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Audit Logging</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>GDPR Compliance</span>
                        <Badge variant="default">Compliant</Badge>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      View Security Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Security Audit Log</CardTitle>
                    <CardDescription>Recent security events and activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div>
                            <p className="font-medium">User login</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">Success</Badge>
                          <p className="text-xs text-gray-500 mt-1">Just now</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
