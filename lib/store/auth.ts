"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "owner" | "staff";
}

interface AuthStore {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  isLoggedIn: () => boolean;
  isOwner: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      isLoggedIn: () => !!get().token,
      isOwner: () => get().user?.role === "owner",
    }),
    {
      name: "dd:auth:v1",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
