"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type User, UserStatus, UserRole, Gender } from "@/types/user.types";
import type { UserAnalytics } from "@/types/user.dto";
import type { PaginationResult } from "@/types/pagination.types";
import { Api } from "@/utils/api";
import { CreateUserDTO } from "../validations/user.validation";

export async function getUsers(
  page = 1,
  limit = 10,
  search?: string,
  status?: UserStatus,
  role?: UserRole,
) {
  const query = new URLSearchParams();

  const queryObj: Record<string, string | undefined> = {
    page: page.toString(),
    limit: limit.toString(),
    search,
    status,
    role
  }

  Object.keys(queryObj).map(k => {
    if (queryObj[k]?.trim()) {
      query.append(k, queryObj[k].trim())
    }
  })

  const result = await Api.get<PaginationResult<User>>(
    `/users?${query.toString()}`,
  );
  return result;
}

export const getUsersAnalytics = async () => {
  const result = await Api.get<{
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
  }>('/users/analytics')

  return result.data;
}

export async function getUserById(id: string) {
  const result = await Api.get<User>(`/users/${id}`);
  return result;
}

export async function createUser(data: CreateUserDTO) {
  const result = await Api.post<User>("/users/register", data);
  if (!result.success) {
    throw result;
  }
  revalidatePath("/users");
  redirect("/users");
}

export async function updateUser(id: string, formData: FormData) {
  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    role: formData.get("role"),
    status: formData.get("status"),
    profileImage: formData.get("profileImage"),
  };

  const result = await Api.put<User>(`/users/${id}`, data);
  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
  return result;
}

export async function deleteUser(id: string) {
  const result = await Api.delete(`/users/${id}`);
  revalidatePath("/users");
  return result;
}

export async function toggleUserStatus(id: string, status: UserStatus) {
  const result = await Api.put(`/users/${id}/status`, { status });

  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
  return result;
}

export async function getUserAnalytics(userId: string) {
  const result = await Api.get<UserAnalytics>(`/users/${userId}/analytics`);
  return result;
}
export async function resetUserPassword(id: string, newPassword: string) {
  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
}
