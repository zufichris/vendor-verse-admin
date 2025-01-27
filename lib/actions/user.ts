'use server'
import { userService } from "../services/user"

export async function getLoggedInUser() {
    const res = await userService.getLoggedInUser()
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