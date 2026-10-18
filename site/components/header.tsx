"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { searchEntries, repoUrl } from "@/lib/catalog";
import { Icon } from "./icons";
import { ThemeButton } from "./preferences";

export function Brand() {
  return (
    <Link href="/" className="brand">
      <span className="brand-mark">{"</>"}</span>
      <span>DSA Demystified</span>
    </Link>
  );
}
export function Header() {
  const pathname = usePathname(),
    dialog = useRef<HTMLDialogElement>(null),
    input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const results = searchEntries
    .filter((x) =>
      `${x.title} ${x.description}`.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 10);
  function open() {
    setQuery("");
    dialog.current?.showModal();
    input.current?.focus();
  }
  useEffect(() => {
    function key(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setQuery("");
        dialog.current?.showModal();
        input.current?.focus();
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Brand />
          <nav aria-label="Main navigation">
            {[
              ["Foundations", "/foundations/"],
              ["Patterns", "/patterns/"],
              ["Practice", "/practice/"],
              ["Company Prep", "/company-prep/"],
              ["Roadmap", "/roadmap/"],
            ].map(([title, href]) => (
              <Link
                key={href}
                href={href}
                className={
                  pathname.startsWith(href) ||
                  (href === "/practice/" && pathname.startsWith("/problems/"))
                    ? "active"
                    : ""
                }
              >
                {title}
              </Link>
            ))}
          </nav>
          <div className="header-tools">
            <button className="search-trigger" onClick={open}>
              <Icon name="search" size={15} />
              <span>Search</span>
              <kbd>⌘ K</kbd>
            </button>
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="icon-button"
              aria-label="GitHub repository"
            >
              <Icon name="github" />
            </a>
            <Link
              href="/saved/"
              className="icon-button"
              aria-label="Saved items"
            >
              <Icon name="bookmark" />
            </Link>
            <ThemeButton />
          </div>
        </div>
      </header>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-labelledby="search-label"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const r = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < r.left ||
              event.clientX > r.right ||
              event.clientY < r.top ||
              event.clientY > r.bottom
            )
              dialog.current?.close();
          }
        }}
      >
        <div className="search-top">
          <Icon name="search" />
          <label htmlFor="lesson-search" id="search-label" className="sr-only">
            Search all content
          </label>
          <input
            id="lesson-search"
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find an idea, a structure, a lesson…"
          />
          <button
            className="icon-button"
            onClick={() => dialog.current?.close()}
            aria-label="Close search"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="search-results">
          {results.length ? (
            results.map((result) => (
              <a
                href={result.href}
                key={result.href}
                onClick={() => dialog.current?.close()}
                target={result.href.startsWith("https") ? "_blank" : undefined}
                rel={result.href.startsWith("https") ? "noreferrer" : undefined}
              >
                <Icon name="book" />
                <span>
                  <strong>{result.title}</strong>
                  <small>{result.description}</small>
                </span>
                <Icon
                  name={result.href.startsWith("http") ? "external" : "arrow"}
                />
              </a>
            ))
          ) : (
            <div className="empty-search">
              <strong>No matching lessons</strong>
              <p>Try “tree”, “traversal”, or another topic.</p>
            </div>
          )}
        </div>
        <div className="search-bottom">
          <Link
            href={"/search/?q=" + encodeURIComponent(query)}
            onClick={() => dialog.current?.close()}
          >
            View all search results <Icon name="arrow" size={12} />
          </Link>
          <span>Esc to close</span>
        </div>
      </dialog>
    </>
  );
}
