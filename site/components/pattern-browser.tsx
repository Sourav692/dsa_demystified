"use client";
import { useState } from "react";
import Link from "next/link";
import type { Pattern } from "@/lib/library";
import { Icon } from "./icons";
export function PatternBrowser({ entries }: { entries: Pattern[] }) {
  const [category, setCategory] = useState(""),
    [q, setQ] = useState(""),
    [ready, setReady] = useState(false);
  const filtered = entries.filter(
    (p) =>
      (!category || p.category === category) &&
      (!ready || p.source) &&
      `${p.title} ${p.signals.join(" ")}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  return (
    <div className="catalog-layout">
      <aside className="catalog-sidebar">
        <span className="sidebar-label">Pattern families</span>
        <button
          className={!category ? "selected" : ""}
          onClick={() => setCategory("")}
        >
          All patterns<small>{entries.length}</small>
        </button>
        {[...new Set(entries.map((p) => p.category))].map((c) => (
          <button
            key={c}
            className={category === c ? "selected" : ""}
            onClick={() => setCategory(c)}
          >
            {c}
            <small>{entries.filter((p) => p.category === c).length}</small>
          </button>
        ))}
      </aside>
      <div className="catalog-main">
        <div className="catalog-filters">
          <div className="filter-input">
            <Icon name="search" size={16} />
            <input
              aria-label="Search patterns"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Find a pattern or a recognition cue…"
            />
          </div>
          <label className="checkbox-filter">
            <input
              type="checkbox"
              checked={ready}
              onChange={(e) => setReady(e.target.checked)}
            />{" "}
            Written explainers only
          </label>
        </div>
        <p className="result-count">{filtered.length} patterns</p>
        <div className="pattern-grid">
          {filtered.map((p) => (
            <Link
              className="pattern-card"
              key={p.slug}
              href={`/patterns/${p.slug}/`}
            >
              <div className="pattern-card-top">
                <Icon name="path" size={24} />
                <span
                  className={`material-status ${p.source ? "available" : ""}`}
                >
                  {p.source ? "Explainer available" : "Explainer planned"}
                </span>
              </div>
              <span className="pattern-category">{p.category}</span>
              <h2>{p.title}</h2>
              <p>{p.signals[0]}</p>
              <div className="pattern-card-bottom">
                <span>
                  {p.problems.length}{" "}
                  {p.problems.length === 1 ? "problem" : "problems"}
                </span>
                <Icon name="arrow" size={17} />
              </div>
            </Link>
          ))}
        </div>
        {!filtered.length && (
          <div className="empty-state">
            <h3>No patterns match your search.</h3>
            <button
              className="button small"
              onClick={() => {
                setQ("");
                setCategory("");
                setReady(false);
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
