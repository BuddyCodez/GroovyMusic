'use client';
import { useSearchStore } from "@/hooks/use-search";
import { SearchProviderProps, SearchState } from "@/types/search";
import { createContext, useContext } from "react";

const SearchContext = createContext<SearchState | undefined>(undefined);

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const store = useSearchStore();
  return (
    <SearchContext.Provider value={store}>{children}</SearchContext.Provider>
  );
};

export const useSearch = (): SearchState => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
