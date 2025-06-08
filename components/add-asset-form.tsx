"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { Package, Loader2, AlertTriangle, Settings } from "lucide-react"
import { addAsset } from "@/lib/asset-actions"
import ProfileSetup from "./profile-setup"
import Link from "next/link"

export default function AddAssetForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    asset_id: "",
    name: "",
    description: "",
    category: "",
    status: "active",
    location: "",
    value: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await addAsset({
        asset_id: formData.asset_id,
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        status: formData.status,
        location: formData.location || null,
        value: formData.value ? Number.parseFloat(formData.value) : null,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        // Reset form
        setFormData({
          asset_id: "",
          name: "",
          description: "",
          category: "",
          status: "active",
          location: "",
          value: "",
        })
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/")
        }, 1500)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateAssetId = () => {
    const prefix = formData.category ? formData.category.toUpperCase().slice(0, 3) : "AST"
    const timestamp = Date.now().toString().slice(-6)
    const randomNum = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0")
    return `${prefix}-${timestamp}-${randomNum}`
  }

  return (
    <div className="space-y-6">
      {/* Profile Setup Component */}
      <ProfileSetup />

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Add New Asset
          </CardTitle>
          <CardDescription>Enter the details for your new asset</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Error:</strong> {error}
                {error.includes("foreign key constraint") && (
                  <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                    <p className="text-sm font-medium text-red-800 mb-2">Profile Issue Detected</p>
                    <p className="text-sm text-red-700 mb-3">
                      This error occurs when your user profile is missing from the database.
                    </p>
                    <div className="space-y-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href="/profile-setup">
                          <Settings className="h-4 w-4 mr-2" />
                          Go to Profile Setup
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                ✅ Asset added successfully! Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asset_id">Asset ID *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="asset_id"
                    placeholder="e.g., AST001"
                    value={formData.asset_id}
                    onChange={(e) => handleInputChange("asset_id", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleInputChange("asset_id", generateAssetId())}
                    className="whitespace-nowrap"
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., MacBook Pro 16"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description of the asset"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it-equipment">IT Equipment</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="av-equipment">AV Equipment</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Office A, Room 101"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Value ($)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 2499.99"
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding Asset...
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    Add Asset
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
