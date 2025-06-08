import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UnifiedAuthProvider } from "@/components/auth/unified-auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AssetTracker Pro - Professional Asset Management System",
  description: "Comprehensive asset management with QR codes, real-time tracking, and team collaboration",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <UnifiedAuthProvider>
            {children}
            <Toaster />
          </UnifiedAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
