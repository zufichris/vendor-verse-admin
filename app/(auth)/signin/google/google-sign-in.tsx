'use client'
import { useToast } from '@/hooks/use-toast'
import { googleSignIn } from '@/lib/actions/auth'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

export const GoogleSignIn = ({ code }: { code: string }) => {
    const router = useRouter()
    const { toast } = useToast()
    const signIn = useCallback(async () => {
        try {
            const res = await googleSignIn(code)
            if (res.success) {
                toast({
                    title: "Sign-in Successful",
                })
            }
        } catch (error) {
            toast({
                title: "Google Sign In Error",
                variant: "destructive"
            })
        } finally {
            router.push("/")
        }
    }, [code])

    useEffect(() => {
        signIn()
    }, [signIn])
    return null
}
