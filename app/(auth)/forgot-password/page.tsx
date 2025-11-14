import React, { Suspense } from 'react'
import ForgotPassword from './component'

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div></div>}>
      <ForgotPassword />
    </Suspense>
  )
}
