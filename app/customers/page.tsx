import { CustomersHeader } from "@/components/customers/customers-header"
import { CustomersList } from "@/components/customers/customers-list"
import { ErrorMessage } from "@/components/ui/error"
import { getCustomers } from "@/lib/actions/user"
import React from "react"

interface CustomerPageProps {
  readonly searchParams: string
}

export default async function CustomersPage({ searchParams }: CustomerPageProps) {
  const qs = new URLSearchParams(searchParams).toString()
  const res = await getCustomers(qs)
  if (!res.success) return <ErrorMessage message={res.message} description={res.description} status={res.status} />

  return (
    <React.Fragment>
      <CustomersHeader
        {...res}
      />
      <CustomersList customers={res.data} filterCount={res.filterCount} />
    </React.Fragment>
  )
}

