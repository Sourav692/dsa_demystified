"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { searchEntries } from "@/lib/catalog";
import { useState } from "react";
import { Icon } from "./icons";
export function SearchResults() {
  const params = useSearchParams(),
    router = useRouter(),
    term = params.get("q") || "";
  const [query, setQuery] = useState(term);
  const results = searchEntries
    .filter((e) =>
      `${e.title} ${e.description}`.toLowerCase().includes(term.toLowerCase()),
    )
    .sort(
      (a, b) =>
        Number(b.title.toLowerCase() === term.toLowerCase()) -
        Number(a.title.toLowerCase() === term.toLowerCase()),
    );
  return (
    <>
      <form
        className="search-page-form"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace("/search/?q=" + encodeURIComponent(query));
        }}
      >
        <input
          aria-label="Search all content"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try a title, a pattern, or a recognition cue…"
        />
        <button className="button primary">
          <Icon name="search" size={16} />
          Search
        </button>
      </form>
      <p className="result-count">
        {results.length} results{term ? ` for “${term}”` : ""}
      </p>
      <div className="search-page-results">
        {results.map((e) => (
          <Link key={e.href} href={e.href}>
            <span>{e.kind}</span>
            <h2>{e.title}</h2>
            <p>{e.description.replace(e.kind + " · ", "")}</p>
            <Icon name="arrow" />
          </Link>
        ))}
      </div>
      {!results.length && (
        <div className="empty-state">
          <h2>No matching content.</h2>
          <p>Try a broader topic or a different spelling.</p>
        </div>
      )}
    </>
  );
}
