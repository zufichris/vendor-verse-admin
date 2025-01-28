import CustomerDetails from '@/components/customers/customer-details'
import { ErrorMessage } from '@/components/ui/error'
import { getCustomerById } from '@/lib/actions/user'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

interface PageProps {
  params: {
    custId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { custId } = params
  const res = await getCustomerById(custId)
  if (!res.success) {
    if (res.status === 400) {
      return notFound()
    }
    return {
      title: `${res.status}-${res.message}`,
      description: res.description,
    }
  }
  return {
    title: res?.data?.firstName,
    description: `${res.data.firstName} has ${res.data?.stats?.totalOrders ?? 0} orders`,
  }
}

export default async function CustomerDetailsPage({ params }: PageProps) {
  const { custId } = params
  const res = await getCustomerById(custId)
  if (!res.success)
    return <ErrorMessage message={res.message} description={res.description} status={res.status} />
  return <CustomerDetails customer={res.data} />
}
