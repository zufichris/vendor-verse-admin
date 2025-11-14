"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyRound, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { confirmPasswordReset, passwordResetRequest } from "@/lib/actions/auth.actions"
import { useRouter, useSearchParams } from "next/navigation"
import { ForgotPasswordEmailInput, forgotPasswordEmailSchema, ForgotPasswordResetInput, forgotPasswordResetSchema } from "@/lib/validations/auth.validations"

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "reset">("email")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const searchParams = useSearchParams()
  const router = useRouter()

  const emailForm = useForm<ForgotPasswordEmailInput>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: {
      email: "",
    },
  })

  const resetForm = useForm<ForgotPasswordResetInput>({
    resolver: zodResolver(forgotPasswordResetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      otpCode: "",
    },
  })

  const onEmailSubmit = async (data: ForgotPasswordEmailInput) => {
    setError("")
    setSuccess("")

    try {
      const response = await passwordResetRequest(data)

      if (!response.success) {
        throw new Error("Failed to send reset email")
      }

      setEmail(data.email)
      setSuccess("Password reset code sent to your email!")
      setTimeout(() => {
        setStep("reset")
        setSuccess("")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  const onResetSubmit = async (data: ForgotPasswordResetInput) => {
    setError("")
    setSuccess("")

    try {
      const response = await confirmPasswordReset({...data, email})

      if (!response.success) {
        throw new Error("Failed to reset password")
      }

      setSuccess("Password reset successfully! Redirecting to login...")
      setTimeout(() => {
        const search = searchParams.toString()
        router.replace(`/login${search.length ? `?${search}`: ''}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  const isEmailSubmitting = emailForm.formState.isSubmitting
  const isResetSubmitting = resetForm.formState.isSubmitting

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === "email" ? "Forgot Password?" : "Reset Your Password"}
          </CardTitle>
          <CardDescription className="text-base">
            {step === "email"
              ? "Enter your email address and we'll send you a code to reset your password"
              : "Enter the code we sent to your email along with your new password"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {step === "email" ? (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    {...emailForm.register("email")}
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isEmailSubmitting}>
                {isEmailSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </Button>

              <div className="text-center">
                <a href="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Back to login
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otpCode">Verification Code</Label>
                <Input
                  id="otpCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  {...resetForm.register("otpCode")}
                />
                {resetForm.formState.errors.otpCode && (
                  <p className="text-sm text-destructive">{resetForm.formState.errors.otpCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  {...resetForm.register("newPassword")}
                />
                {resetForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  {...resetForm.register("confirmPassword")}
                />
                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">{resetForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isResetSubmitting}>
                {isResetSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
