"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDemoAuth } from "@/components/auth/demo-auth-provider"
import { useAuth } from "@/components/auth/auth-provider"
import AssetDashboard from "@/components/asset-dashboard"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [assets, setAssets] = useState([])
  
  const demoAuth = useDemoAuth()
  const realAuth = useAuth()
  const supabase = createClient()

  const hasSupabaseConfig =
    typeof window !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const currentUser = hasSupabaseConfig ? realAuth?.user : demoAuth?.user
  const authLoading = hasSupabaseConfig ? realAuth?.loading : demoAuth?.loading || false

  useEffect(() => {
    async function handleAuthAndData() {
      console.log("HomePage: Auth loading:", authLoading, "User:", !!currentUser)
      
      // Wait for auth to finish loading
      if (authLoading) {
        return
      }

      // If no user, redirect to login
      if (!currentUser) {
        console.log("HomePage: No user found, redirecting to login")
        router.replace("/login")
        return
      }

      console.log("HomePage: User authenticated:", currentUser.email, "Loading dashboard data")
      setIsLoading(true)
      setUser(currentUser)

      try {
        if (hasSupabaseConfig && currentUser) {
          // Load real data from Supabase
          console.log("Loading real data from Supabase")
          
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
        } else {
          // Demo mode - use mock data
          console.log("Loading demo data for user:", currentUser.email)
          setProfile({
            id: currentUser.id,
            full_name: currentUser.full_name,
            email: currentUser.email,
            role: currentUser.role,
            avatar_url: currentUser.avatar_url,
          })

          // Mock assets data for demo
          setAssets([
            {
              id: "1",
              asset_id: "DEMO-001",
              name: 'MacBook Pro 16"',
              category: "it-equipment",
              status: "active",
              location: "Office A - Desk 12",
              value: 2499.99,
              assignee: { full_name: "John Doe" },
              created_at: "2024-01-15T10:00:00Z",
              updated_at: "2024-01-15T10:00:00Z",
            },
            {
              id: "2",
              asset_id: "DEMO-002",
              name: "Ergonomic Office Chair",
              category: "furniture",
              status: "active",
              location: "Office A - Desk 12",
              value: 299.99,
              assignee: { full_name: "Jane Smith" },
              created_at: "2024-01-10T09:00:00Z",
              updated_at: "2024-01-10T09:00:00Z",
            },
            {
              id: "3",
              asset_id: "DEMO-003",
              name: "4K Projector",
              category: "av-equipment",
              status: "maintenance",
              location: "Conference Room B",
              value: 899.99,
              assignee: null,
              created_at: "2024-01-05T14:30:00Z",
              updated_at: "2024-01-20T11:15:00Z",
            },
          ])
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    handleAuthAndData()
  }, [currentUser, authLoading, hasSupabaseConfig, router])

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Checking Authentication...
            </CardTitle>
            <CardDescription>Please wait while we verify your login status</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Show loading while dashboard data is being loaded
  if (isLoading && currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Loading Dashboard...
            </CardTitle>
            <CardDescription>Preparing your asset management dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // If no user after auth check, show redirecting message
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Redirecting to Login...
            </CardTitle>
            <CardDescription>You need to be logged in to access the dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Show dashboard
  return <AssetDashboard user={user} profile={profile} assets={assets} />
}