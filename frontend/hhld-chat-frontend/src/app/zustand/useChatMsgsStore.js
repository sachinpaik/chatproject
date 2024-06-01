import {create} from "zustand";


export const useChatMsgsStore = create((set) =>({
    chatMsgs: [],
    newChatMsgs : (newMsg)=> set({ chatMsgs: newMsg }),
    updateChatMsgs: (newMsg) => set((state) => ({ chatMsgs: [...state.chatMsgs, newMsg] })),
    resetChatMsgs: () => set({ chatMsgs: [] })
}));