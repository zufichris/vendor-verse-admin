import { create } from "zustand";
import { User } from "@/types/user.types";
import { getLoggedInUser, logout } from "../actions/auth.actions";

interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    isLoding: boolean;
    error?: string;
    init: () => Promise<boolean>;
    setUser: (user: User) => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    isAuthenticated: false,
    user: null,
    isLoding: false,

    init: async function () {
        const state = get()
        if (state.isAuthenticated && state.user) {
            return true
        }

        set({ isLoding: true });
        const res = await getLoggedInUser();
        if (!res.success) {
            set({
                isAuthenticated: false,
                user: null,
                isLoding: false,
                error: res.message,
            });
            return false;
        }
        set({ isAuthenticated: true, user: res.data, isLoding: false });
        return true
    },

    setUser: function (user: User) {
        set({ user, isAuthenticated: true });
    },

    logout: async function () {
        await logout();
        console.log('setting')
        set({ user: null, isAuthenticated: false });
    },
}));
