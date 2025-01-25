'use server'

import { request } from "../utils"
import { IResponseData, IResponseDataPaginated } from "../types/global"
import { TUser } from "../types/user"
import { getToken } from "./auth"

export async function getLoggedInUser() {
    try {
        const token = await getToken('access_token')
        if (!token) {
            throw new Error('No token found')
        }
        const res = await request<IResponseData<TUser> | null>('/me')
        return res?.success ? res : null
    } catch (error) {
        return null
    }
}

export async function getCustomers(): Promise<IResponseDataPaginated<TUser> | null> {
    try {
        const res = await request<IResponseDataPaginated<TUser>>('/users/?limit=10&page=1')
        return res
    } catch (error) {
        return null
    }
}

export async function createNewUser(data: {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
}) {
    try {
        const res = request<IResponseData<TUser>>('/users/', {
            method: "POST",
            body: JSON.stringify(data)
        })
        return res
    } catch (error) {
        throw error
    }
}