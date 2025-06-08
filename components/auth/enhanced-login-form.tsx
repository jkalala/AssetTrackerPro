"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, AlertTriangle, Package, Shield, Users, Info } from "lucide-react"
import Link from "next/link"
import { useDemoAuth } from "./demo-auth-provider"
import { useAuth } from "./auth-provider"

export default function EnhancedLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const demoAuth = useDemoAuth()
  const realAuth = useAuth()

  // Check if we have Supabase config
  const hasSupabaseConfig =
    typeof window !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isDemo = !hasSupabaseConfig

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isDemo && demoAuth) {
        // Demo mode login
        const result = await demoAuth.signIn(email, password)
        if (result.success) {
          router.push("/")
          router.refresh()
        } else {
          setError(result.error || "Login failed")
        }
      } else if (realAuth) {
        // Real Supabase login
        // This would use the real auth system
        setError("Real authentication not configured")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  const handleQuickDemo = () => {
    router.push("/demo")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AssetTracker Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/demo" className="text-sm text-blue-600 hover:text-blue-800">
                View Demo
              </Link>
              <Link href="/preview" className="text-sm text-blue-600 hover:text-blue-800">
                QR Features
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your AssetTracker Pro account</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                {isDemo ? "Demo Mode - Try the credentials below" : "Access your asset management dashboard"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Demo Mode Notice */}
              {isDemo && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Demo Mode:</strong> This is a fully functional demo. Use the credentials below or click
                    "Quick Demo Access".
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Demo Credentials */}
              {isDemo && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-gray-900">Demo Credentials:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Admin:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDemoLogin("demo@assettracker.com", "demo123")}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        demo@assettracker.com / demo123
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Admin:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDemoLogin("admin@assettracker.com", "admin123")}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        admin@assettracker.com / admin123
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">User:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDemoLogin("user@assettracker.com", "user123")}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        user@assettracker.com / user123
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Demo Access */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Quick Demo Access</span>
                </div>
                <p className="text-sm text-green-700 mb-3">Skip login and explore the system with sample data</p>
                <Button onClick={handleQuickDemo} variant="outline" className="w-full border-green-300 text-green-700">
                  Access Demo Dashboard
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or sign in with credentials</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              {!isDemo && (
                <div className="text-center text-sm">
                  {"Don't have an account? "}
                  <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign up
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="mx-auto h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">Asset Tracking</p>
            </div>
            <div className="space-y-2">
              <div className="mx-auto h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-600">QR Codes</p>
            </div>
            <div className="space-y-2">
              <div className="mx-auto h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">Team Collaboration</p>
            </div>
          </div>

          {/* Help Links */}
          <div className="text-center space-y-2">
            <div className="flex justify-center space-x-4 text-sm">
              <Link href="/preview" className="text-blue-600 hover:text-blue-800">
                View Features
              </Link>
              <Link href="/demo" className="text-blue-600 hover:text-blue-800">
                Interactive Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
