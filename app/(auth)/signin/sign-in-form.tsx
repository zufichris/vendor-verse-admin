'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { signIn } from '@/lib/actions/auth'
import { Store } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from "@/components/ui/label"
import React, { useEffect, useTransition } from 'react'
import { request } from '@/lib/utils'

export const SignInForm = () => {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()
    const router = useRouter()
    const searchParams = useSearchParams()
    useEffect(() => {
        if (searchParams.get("error")) {
            toast({
                message: "Google Signin Error",
                success: false,
            })
        }
    }, [])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        startTransition(async () => {
            try {
                const result = await signIn({
                    email: formData.get("email") as string,
                    password: formData.get("password") as string,
                })
                if (!result.success) {
                    toast(result)
                    return
                }

                toast(result)

                router.push("/")
                router.refresh()
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An unexpected error occurred. Please try again.",
                })
            }
        })
    }
    async function handleGoogleSignIn() {
        startTransition(async () => {
            try {
                await new Promise(r => r(setTimeout(() => { }, 4000)))
                const res = await request('/auth/google?callback=http://localhost')
                if (res.success) {
                    return router.push(res.redirect?.path!)
                }
                throw new Error("Google Sign In Error")
            } catch (error) {
                toast({
                    title: "Google Sign In Error"
                })
            }
        })
    }

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
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                                disabled={isPending}
                            />
                        </div>
                        <Button type="submit" className="w-full" size="lg" isLoading={isPending} loadingText="Signing in...">
                            Sign In
                        </Button>
                        <hr />
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            size="lg"
                            onClick={handleGoogleSignIn}
                            disabled={isPending}
                        >
                            {isPending ? (
                                "Signing in..."
                            ) : (
                                <>
                                    <svg
                                        className="mr-2 h-4 w-4"
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fab"
                                        data-icon="google"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 488 512"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                        ></path>
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </Button>
                    </CardContent>
                </form>
                <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">

                </CardFooter>
            </Card>
        </div>
    )
}