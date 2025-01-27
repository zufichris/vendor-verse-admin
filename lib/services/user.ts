import { IResponseData, IResponseDataPaginated } from "../types/global"
import { TUser } from "../types/user"
import { request } from "../utils"

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
    async getLoggedInUser(): Promise<IResponseData<TUser>> {
        try {
            const res = await request<IResponseData<TUser>>('/me')
            return res
        } catch (error) {
            return this.handleError({
                message: "Login Error"
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