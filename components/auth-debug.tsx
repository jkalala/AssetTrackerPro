"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthDebug() {
  const [authInfo, setAuthInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getAuthInfo() {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const { data: userData } = await supabase.auth.getUser()

        setAuthInfo({
          session: sessionData.session,
          user: userData.user,
        })
      } catch (error) {
        console.error("Error fetching auth info:", error)
      } finally {
        setLoading(false)
      }
    }

    getAuthInfo()
  }, [])

  const handleTestGithub = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      console.log("GitHub auth response:", { data, error })

      if (error) {
        console.error("GitHub auth error:", error)
      }
    } catch (err) {
      console.error("Unexpected GitHub auth error:", err)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
        <CardDescription>Check your authentication status and configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div>Loading authentication information...</div>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Authentication Status</h3>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                <pre className="text-xs">{JSON.stringify(authInfo, null, 2)}</pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Environment Variables</h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <p>
                  <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{" "}
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
                </p>
                <p>
                  <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{" "}
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Test Authentication</h3>
              <Button onClick={handleTestGithub}>Test GitHub Auth</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
