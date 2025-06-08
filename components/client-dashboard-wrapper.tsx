"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import AssetDashboard from "@/components/asset-dashboard"
import SafeAuthWrapper from "@/components/safe-auth-wrapper"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Download, Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"

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
}

export default function ClientDashboardWrapper() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const supabase = createClient()

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        throw new Error(`Authentication failed: ${userError.message}`)
      }

      if (!currentUser) {
        window.location.href = "/login"
        return
      }

      setUser(currentUser)

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile error:", profileError)
      } else {
        setProfile(profileData)
      }

      // Get assets data
      const { data: assetsData, error: assetsError } = await supabase
        .from("assets")
        .select(`
          *,
          assignee:assignee_id(full_name),
          created_by_profile:created_by(full_name)
        `)
        .order("created_at", { ascending: false })

      if (assetsError) {
        console.error("Assets error:", assetsError)
        setAssets([])
      } else {
        setAssets(assetsData || [])
      }
    } catch (err) {
      console.error("Dashboard data error:", err)
      setError(err instanceof Error ? err.message : "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    loadDashboardData()
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <SafeAuthWrapper>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Loading Dashboard
              </CardTitle>
              <CardDescription className="text-center">
                Connecting to database and loading your assets...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                </div>
                <p className="text-sm text-gray-600 text-center">This may take a moment in the preview environment</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SafeAuthWrapper>
    )
  }

  if (error) {
    return (
      <SafeAuthWrapper>
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Dashboard Loading Error
                </CardTitle>
                <CardDescription className="text-red-700">
                  Unable to load the dashboard. This may be due to network connectivity issues.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Error:</strong> {error}
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-medium text-red-800">What you can try:</h4>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    <li>Check your internet connection</li>
                    <li>Wait a moment and try again</li>
                    <li>Refresh the entire page</li>
                    <li>Download the code and run it locally</li>
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleRetry} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry ({retryCount})
                  </Button>
                  <Button onClick={() => window.location.reload()} size="sm">
                    Refresh Page
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Code
                  </Button>
                </div>

                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>v0 Preview Note:</strong> The preview environment may have network restrictions. For full
                    functionality, consider downloading and running the code locally.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SafeAuthWrapper>
    )
  }

  if (!user) {
    return (
      <SafeAuthWrapper>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card>
            <CardContent className="pt-6">
              <p>Redirecting to login...</p>
            </CardContent>
          </Card>
        </div>
      </SafeAuthWrapper>
    )
  }

  return (
    <SafeAuthWrapper>
      <AssetDashboard user={user} profile={profile} assets={assets} />
    </SafeAuthWrapper>
  )
}
