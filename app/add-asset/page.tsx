"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AddAssetForm from "@/components/add-asset-form"
import { createClient } from "@/lib/supabase/client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AddAssetPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
          return
        }

        setUser(user)
      } catch (error) {
        console.log("Auth check failed, continuing in demo mode")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Loading...
            </CardTitle>
            <CardDescription>Checking authentication status</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <AddAssetForm />
    </div>
  )
}
