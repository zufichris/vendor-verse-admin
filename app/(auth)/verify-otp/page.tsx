'use client'

import { VerifyOtpForm } from '@/components/auth/verify-otp-form'
import { resendVerification, verifyOtp } from '@/lib/actions/auth.actions'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export default function VerifyOtpPage() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email')?.toString()
    const userId = searchParams.get('userId')?.toString()
    const callbackUrl = searchParams.get('callbackUrl')?.toString()
    const router = useRouter()

    const onVerify = async(otp:string)=>{
        if (!email && !userId) {
            throw new Error("Invalid otp")
        }

        const verified =  await verifyOtp({email, userId, otp, callbackUrl })

        if (verified.success) {
            router.replace(callbackUrl || '/')
        }

        return verified
    }

    const onResend = async()=>{
        await resendVerification({email, userId })
    }

  return (
    <>
        <VerifyOtpForm onResend={onResend} onVerify={onVerify} countdownSeconds={300} otpLength={6} email={email} />
    </>
  )
}
