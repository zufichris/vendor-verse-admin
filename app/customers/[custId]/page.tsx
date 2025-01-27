import CustomerDetails from '@/components/customers/customer-details'
import React from 'react'
import { promisify } from 'util'


export default async function CustomerDetailsPage() {
  await promisify(setTimeout)(3000)
  return (
    <CustomerDetails />
  )
}

