"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SearchResult = {
  title: string;
  description: string;
  type: "Documentation" | "Code";
};

const mockResults: SearchResult[] = [
  {
    title: "Authentication Flow Guide",
    description:
      "...the primary authentication mechanism uses JSON Web Tokens (JWTs). When a user logs in, a token is generated and must be included in the Authorization header...",
    type: "Documentation",
  },
  {
    title: "src/hooks/use-auth.ts",
    description:
      "// This hook manages the user's authentication state, providing functions for login, logout, and checking the current session...",
    type: "Code",
  },
  {
    title: "API Reference: /login",
    description:
      "Handles user authentication. Accepts a POST request with `email` and `password`. Returns a JWT upon successful authentication.",
    type: "Documentation",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setResults([]);
    setTimeout(() => {
      setResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1 className="font-headline text-3xl font-semibold">Semantic Search</h1>
      <p className="text-muted-foreground">
        Use natural language to search across all your connected repositories'
        code and documentation.
      </p>

      <form onSubmit={handleSearch} className="flex w-full max-w-2xl items-center space-x-2">
        <Input
          type="text"
          placeholder="e.g., 'How does the authentication flow work?'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 text-base"
        />
        <Button type="submit" size="lg" className="h-12 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
          <Search className="mr-2 h-5 w-5" />
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        {isLoading &&
          [...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-muted animate-pulse mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full rounded bg-muted animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-muted animate-pulse mt-2" />
              </CardContent>
            </Card>
          ))}
        {results.map((result, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{result.title}</CardTitle>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    result.type === "Documentation"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {result.type}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{result.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
