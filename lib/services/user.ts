import { IResponseData, IResponseDataPaginated } from "../types/global"
import { TUser } from "../types/user"
import { request } from "../utils"
import jwt from "jsonwebtoken"
class UserService {
    constructor(private readonly baseUrl = '/users') {
        this.create = this.create.bind(this)
        this.getCustomers = this.getCustomers.bind(this)
    }
    async create(data: {
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
    }): Promise<IResponseData<TUser>> {
        try {
            const res = await request<IResponseData<TUser>>(this.baseUrl, {
                method: "POST",
                body: JSON.stringify(data)
            })
            return res
        } catch (error) {
            return this.handleError({
                message: "Error Creating User"
            })
        }
    }
    async getCustomers(qs?: string): Promise<IResponseDataPaginated<TUser> & {
        activeCount: number,
        suspendedCount: number,
    }> {
        try {
            const res = await request<IResponseDataPaginated<TUser> & {
                activeCount: number,
                suspendedCount: number,
            }>(`${this.baseUrl}/?${qs ?? ""}`)
            return res
        } catch (error) {
            return this.handleError({
                message: "Error Getting Customers"
            })
        }
    }
    async getLoggedInUser(access_token: string, secret: string): Promise<IResponseData<TUser>> {
        try {
            if (!access_token || !secret) {
                throw new Error("Invalid Verification Data")
            }
            const data = jwt.verify(access_token, secret) as Record<string, unknown>

            if (!data['email']) {
                throw new Error("Invalid Token")
            }

            return ({
                success: true,
                data: data as TUser,
                message: "User Retrieved Successfully",
                status: 200,
            })
        } catch (error) {
            return this.handleError({
                message: "Error Retrieving User"
            })
        }
    }
    async getCustomerById(custId: string): Promise<IResponseData<TUser>> {
        try {
            if (!custId)
                throw new Error("Invalid Customer ID")
            const res = await request<IResponseData<TUser>>(`${this.baseUrl}/${custId}`)
            return res
        } catch (error) {
            return this.handleError({
                message: "Error Getting Customer"
            })
        }
    }
    private handleError<T = IResponseData<TUser>>(err?: {
        message?: string,
        status?: number,
        desc?: string
    }) {
        return ({
            success: false,
            message: err?.message ?? 'An Error Occurred',
            status: err?.status ?? 500,
            description: err?.desc ?? "Process Failed with Status Code 500",
        }) as T
    }
}

export const userService = new UserService('/users')