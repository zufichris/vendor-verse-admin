import { redirect } from "next/navigation"
interface CallbackParams {
    readonly searchParams: { code?: string; error?: string }
}
export default async function CallbackPage({
    searchParams,
}: CallbackParams) {
    redirect(`/api/auth/callback?code=${searchParams.code}`)
}

