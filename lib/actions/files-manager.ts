import axios from "axios"
import { getAuthToken } from "./auth.actions";
import { Api } from "@/utils/api";

export const uploadFile = async (formData: FormData, signal?: AbortSignal, isMany: boolean = false) => {
    const token = await getAuthToken()

    const headers = token ? {
        Authorization: `Bearer ${token}`
    } : {}

    const { data } = await axios.post<{ data: string | string[] }>(`${Api.baseUrl}/files-manager/upload`, formData, {
        signal: signal,
        headers
    });

    if (isMany) {
        return Array.isArray(data.data) ? data.data : [data.data]
    }

    const fileUrl = Array.isArray(data.data) ? data.data[0] : data.data;

    return fileUrl;
}