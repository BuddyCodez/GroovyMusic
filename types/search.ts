export interface SearchState {
    query: string;
    setQuery: (query: string) => void;
}
export interface SearchProviderProps {
    children: React.ReactNode;
}