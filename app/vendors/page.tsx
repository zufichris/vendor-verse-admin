import { VendorsList } from "@/components/vendors/vendors-list"
import { VendorsHeader } from "@/components/vendors/vendor-header"
import { getLoggedInUser } from "@/lib/actions/user"

export default async function VendorsPage() {
  const res = await getLoggedInUser()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return (
    <div className="flex flex-col gap-6 w-full pt-0">
      <VendorsHeader />
      <VendorsList />
    </div>
  )
}

