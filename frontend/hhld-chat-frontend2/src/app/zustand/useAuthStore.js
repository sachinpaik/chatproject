import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

export const useAuthStore = create(persist(
    (set) => ({
        authName: '',
        updateAuthName: (name) => set({authName:name})
    }), {
        name: 'auth-storage',
        storage: createJSONStorage(() => sessionStorage)
    }))