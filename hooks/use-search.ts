import { SearchState } from "@/types/search";
import { create } from "zustand";

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));
