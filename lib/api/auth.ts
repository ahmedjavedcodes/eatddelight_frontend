import { apiFetch } from "./client";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "owner" | "staff";
  };
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshToken(token: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/admin/auth/refresh", {
    method: "POST",
    token,
  });
}
