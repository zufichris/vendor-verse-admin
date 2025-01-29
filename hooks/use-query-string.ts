import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export const useQueryString = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [search, setSearch] = useState("")
    const queryString = useCallback(
        (qObj: Record<string, any>) => {
            const search = new URLSearchParams(searchParams.toString())
            Object.keys(qObj).forEach((key) => {
                if (!qObj[key]) {
                    search.delete(key)
                    delete qObj[key]
                } else {
                    search.set(key, qObj[key])
                }
            })
            setSearch(search.toString())
        },
        [searchParams],
    )
    useEffect(() => {
        router.push(`?${search}`)
    }, [search])
    return { search, searchParams, router, queryString }
}
