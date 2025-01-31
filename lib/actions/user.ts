'use server'
import { userService } from "../services/user"
import { getToken } from "./auth"

export async function getLoggedInUser() {
    const accessToken = await getToken("access_token")
    const res = await userService.getLoggedInUser(accessToken!, process.env.JWT_SECRET!)
    return res
}

export async function getCustomers(qs?: string) {
    const res = await userService.getCustomers(qs)
    return res
}

export async function createNewUser(data: {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
}) {
    const res = await userService.create(data)
    return res
}

export async function getCustomerById(custId: string) {
    const res = await userService.getCustomerById(custId)
    return res
}