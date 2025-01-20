import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Store } from "lucide-react"

export const metadata: Metadata = {
  title: "Sign In - VendorVerse",
  description: "Sign in to your VendorVerse account",
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2 justify-center">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold">VendorVerse</span>
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>
          <Button className="w-full" size="lg">
            Sign In
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Don't have an account?</span>
            <Button variant="link" className="p-0 h-auto font-normal" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
          <Button variant="link" className="p-0 h-auto font-normal">
            Forgot your password?
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

