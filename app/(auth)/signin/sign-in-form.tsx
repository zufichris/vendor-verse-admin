'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { signIn } from '@/lib/actions/auth'
import { Store } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Label } from "@/components/ui/label"
import React, { useTransition } from 'react'

const SingnInForm = () => {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()
    const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        startTransition(async () => {
            try {
                const result = await signIn({
                    email: formData.get("email") as string,
                    password: formData.get("password") as string,
                })

                if (!result) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        // description: result.error,
                    })
                    return
                }

                toast({
                    title: "Success",
                    description: "Successfully signed in",
                })

                router.push("/")
                router.refresh()
            } catch (error) {
                console.log(error)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An unexpected error occurred. Please try again.",
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
                    </CardContent>
                </form>
                <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">

                </CardFooter>
            </Card>
        </div>
    )
}

export default SingnInForm