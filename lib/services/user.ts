import { promisify } from "util"
import { IResponseData, IResponseDataPaginated } from "../types/global"
import { TUser } from "../types/user"
import { request } from "../utils"
import jwt from "jsonwebtoken"
import { createMockUser, createMockUsers } from "../mock/mock"
class UserService {
    constructor(private readonly baseUrl = '/users') {
        this.create = this.create.bind(this)
        this.getCustomers = this.getCustomers.bind(this)
        this.getLoggedInUser = this.getLoggedInUser.bind(this)
        this.getCustomerById = this.getCustomerById.bind(this)
    }
    async create(data: {
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
    }): Promise<IResponseData<TUser>> {
        try {
            await promisify(setTimeout)(1000)
            return {
                success: true,
                data: createMockUser(),
                message: "User Created Successfully",
                status: 200,
            }
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
            await promisify(setTimeout)(1000)
            return {
                success: true,
                data: createMockUsers(),
                message: "Customers Retrieved Successfully",
                status: 200,
                activeCount: 5,
                suspendedCount: 5,
                filterCount: 10,
                totalCount: 10,
                firstItemIndex: 0,
                lastItemIndex: 9,
                hasNextPage: false,
                hasPreviousPage: false,
                limit: 10,
                page: 1,
                totalPages: 1,
            }
        } catch (error) {
            return this.handleError({
                message: "Error Getting Customers"
            })
        }
    }
    async getLoggedInUser(access_token?: string, secret?: string): Promise<IResponseData<TUser>> {
        try {
            await promisify(setTimeout)(1000)
            return ({
                success: true,
                message: "User Retrieved Successfully",
                status: 200,
                data: createMockUser()
            })
        } catch (error) {
            return this.handleError({
                message: "Error Retrieving User"
            })
        }
    }
    async getCustomerById(custId?: string): Promise<IResponseData<TUser>> {
        try {
            await promisify(setTimeout)(1000)
            return {
                success: true,
                data: createMockUser(),
                message: "Customer Retrieved Successfully",
                status: 200,
            }
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