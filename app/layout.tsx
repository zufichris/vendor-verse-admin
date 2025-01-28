import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/providers/toast-provider"
import { DashboardShell } from "@/components/dashboard-shell"
import { getLoggedInUser } from "@/lib/actions/user"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VendorVerse Admin",
  description: "Multi-vendor E-commerce Admin Dashboard",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const res = await getLoggedInUser()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}  min-h-screen bg-gradient-to-b from-background to-muted/20 dark:from-background dark:to-muted/20`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {res?.success ? <DashboardShell user={res?.data} success={res.success}>
            {children}
          </DashboardShell> : <>{children}</>}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}

