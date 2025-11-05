"use client"

import { useState, useEffect, useRef, type KeyboardEvent, type ClipboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShieldCheck, Mail } from "lucide-react"
import { AuthData } from "@/types/auth.types"

interface VerifyOtpProps {
  email?: string
  phoneNumber?: string
  onVerify: (otp: string) => Promise<{
    data: null|AuthData;
    success: boolean;
    status: number;
    message: string;
}>
  onResend: () => Promise<void>
  otpLength?: number
  countdownSeconds?: number
}

export function VerifyOtpForm({
  email,
  phoneNumber,
  onVerify,
  onResend,
  otpLength = 6,
  countdownSeconds = 60,
}: VerifyOtpProps) {
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(""))
  const [countdown, setCountdown] = useState(countdownSeconds)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string>("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]

    // Handle paste of multiple digits
    if (value.length > 1) {
      const digits = value.slice(0, otpLength).split("")
      digits.forEach((digit, i) => {
        if (index + i < otpLength) {
          newOtp[index + i] = digit
        }
      })
      setOtp(newOtp)

      // Focus last filled input or next empty
      const nextIndex = Math.min(index + digits.length, otpLength - 1)
      inputRefs.current[nextIndex]?.focus()
    } else {
      // Single digit input
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < otpLength - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    setError("")

    // Auto-verify when all digits are filled
    const completeOtp = newOtp.join("")
    if (completeOtp.length === otpLength && !newOtp.includes("")) {
      handleVerify(completeOtp)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      const newOtp = [...otp]

      if (otp[index]) {
        // Clear current input
        newOtp[index] = ""
        setOtp(newOtp)
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = ""
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()
    const digits = pastedData.replace(/\D/g, "").slice(0, otpLength).split("")

    const newOtp = [...otp]
    digits.forEach((digit, i) => {
      newOtp[i] = digit
    })
    setOtp(newOtp)

    // Focus last filled input
    const lastIndex = Math.min(digits.length - 1, otpLength - 1)
    inputRefs.current[lastIndex]?.focus()

    // Auto-verify if complete
    if (digits.length === otpLength) {
      handleVerify(digits.join(""))
    }
  }

  const handleVerify = async (otpValue: string) => {
    setIsVerifying(true)
    setError("")

    const defaultMessage = 'Invalid OTP. Please try again.'

    try {
      const res = await onVerify(otpValue)
      if (!res.success) {
        setError(res.message || defaultMessage)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : defaultMessage)
      setOtp(Array(otpLength).fill(""))
      inputRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setError("")
    setOtp(Array(otpLength).fill(""))

    try {
      await onResend()
      setCountdown(countdownSeconds)
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const canResend = countdown === 0 && !isVerifying && !isResending

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold">Verify Your Code</CardTitle>
          <CardDescription className="text-base">
            {email && (
              <>
                {"We sent a verification code to "}
                <span className="font-medium text-foreground">{email}</span>
              </>
            )}
            {phoneNumber && (
              <>
                {"We sent a verification code to "}
                <span className="font-medium text-foreground">{phoneNumber}</span>
              </>
            )}
            {!email && !phoneNumber && "Enter the verification code sent to you"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OTP Input Fields */}
          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isVerifying}
                  className="h-12 w-12 text-center text-lg font-semibold transition-all focus:ring-2 focus:ring-primary disabled:opacity-50"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {error && (
              <p className="text-center text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Countdown and Resend */}
          <div className="space-y-3">
            {countdown > 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                {"Resend code in "}
                <span className="font-semibold text-foreground">{formatTime(countdown)}</span>
              </p>
            ) : (
              <p className="text-center text-sm text-muted-foreground">{"Didn't receive the code?"}</p>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleResend}
              disabled={!canResend}
            >
              {isResending ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Code
                </>
              )}
            </Button>
          </div>

          {/* Loading State */}
          {isVerifying && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Verifying...
            </div>
          )}

          {/* Help Text */}
          <p className="text-center text-xs text-muted-foreground">
            {"Make sure to check your spam folder if you don't see the code"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
