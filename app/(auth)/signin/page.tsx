import type { Metadata } from "next"
import { SignInForm } from "./sign-in-form"


export const metadata: Metadata = {
  title: "Sign In - VendorVerse",
  description: "Sign in to your VendorVerse account",
}

export default function SignInPage() {
  return (
    <SignInForm />
  )
}

