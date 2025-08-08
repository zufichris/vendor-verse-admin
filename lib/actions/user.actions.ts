"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type User, UserStatus, UserRole, Gender } from "@/types/user.types";
import type { UserAnalytics } from "@/types/user.dto";
import type { PaginationResult } from "@/types/pagination.types";
import { Api } from "@/utils/api";
import { Urbanist } from "next/font/google";

// Validation schemas
const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER),
  referredBy: z.string().optional(),
  marketingConsent: z.boolean().optional(),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  profileImage: z.string().optional(),
});

export async function getUsers(
  page = 1,
  limit = 10,
  search?: string,
  status?: UserStatus,
  role?: UserRole,
) {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search || "",
    status: status || "",
    role: role || "",
  });

  const result = await Api.get<PaginationResult<User>>(
    `/users?${query.toString()}`,
  );
  return result;
}

export async function getUserById(id: string) {
  const result = await Api.get<User>(`/users/${id}`);
  return result;
}

export async function createUser(formData: FormData) {
  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    role: formData.get("role"),
    referredBy: formData.get("referredBy"),
    marketingConsent: formData.get("marketingConsent") === "on",
  };

  const result = await Api.post<User>("/users", data);
  revalidatePath("/admin/users");
  redirect("/admin/users");
  return result;
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
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
  return result;
}

export async function deleteUser(id: string) {
  const result = await Api.delete(`/users/${id}`);
  revalidatePath("/admin/users");
  return result;
}

export async function toggleUserStatus(id: string, status: UserStatus) {
  const result = await Api.patch(`/users/${id}/status`, { status });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
  return result;
}

export async function getUserAnalytics(userId: string) {
  const result = await Api.get<UserAnalytics>(`/users/${userId}/analytics`);
  return result;
}
export async function resetUserPassword(id: string, newPassword: string) {
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
}
