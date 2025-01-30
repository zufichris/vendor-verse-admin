import { ISearchData } from "@/lib/types/global";
import { useCallback, useState, useTransition } from "react";

export function useSearch(fetchFunction: (query: string) => Promise<ISearchData[]>) {
    const [data, setData] = useState<ISearchData[]>([]);
    const [success, setSuccess] = useState(false);
    const [isLoading, startTransition] = useTransition();
    const [searchText, setSearchText] = useState("");


    const getData = useCallback(async () => {
        startTransition(async () => {
            try {
                if (!searchText.length) {
                    setData([]);
                    setSuccess(false);
                    return;
                }
                const res = await fetchFunction(searchText);
                if (!res?.length) {
                    setData([])
                } else {
                    setData(res)
                }
            } catch (error) {
                setSuccess(false);
                setData([]);
            }
        });
    }, [searchText, fetchFunction]);

    return { getData, isLoading, success, data, setSearchText, searchText };
}
