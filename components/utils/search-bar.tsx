"use client";

import { Command, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useSearch } from "../api/use-search";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
interface SearchBarProps {
  onSearch?: (query: string) => void;
}
const SearchBar = ({ onSearch }: SearchBarProps) => {
  const search = useSearch();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "," && e.ctrlKey) {
        // console.log("focus");
        e.preventDefault();
        document.getElementById("search")?.focus();
      }
    });
  }, []);
  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      search.setQuery(query);
      onSearch?.(query);
    }
  }, []);
  return (
    <div className="relative w-full max-w-[calc(100%-4rem)]">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        className="pl-8 text-white border-gray-700"
        value={search.query}
        id="search"
        onChange={(e) => {
          const term = e.target.value;
          search.setQuery(term);
          //   " i want instead like search/keyword"
          const params = new URLSearchParams(searchParams);
          if (term) {
            params.set("query", term);
          } else {
            params.delete("query");
          }
          replace(`${term ? "/search" : "/"}?${params.toString()}`);
          // since the page change we need to focus the input
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch?.(search.query);
          }
        }}
      />
      <div className="absolute right-2.5 top-1.5 items-center text-muted-foreground flex gap-2">
        <span>Ctrl + ,</span>
      </div>
    </div>
  );
};

export { SearchBar };
