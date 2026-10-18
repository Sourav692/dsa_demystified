"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import type { Problem, Pattern } from "@/lib/library";
import { useList, BookmarkButton, CompletionButton } from "./preferences";
import { Icon } from "./icons";

export function PracticeCatalog({
  entries,
  patternEntries,
  track = "all",
}: {
  entries: Problem[];
  patternEntries: Pattern[];
  track?: string;
}) {
  const params = useSearchParams(),
    pathname = usePathname(),
    completed = useList("completed");
  const term = params.get("q") || "",
    topic = params.get("topic") || "",
    difficulty = params.get("difficulty") || "",
    availability = params.get("availability") || "",
    status = params.get("status") || "",
    pattern = params.get("pattern") || "",
    sort = params.get("sort") || "order";
  function change(name: string, value: string) {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(name, value);
    else next.delete(name);
    if (name !== "page") next.delete("page");
    // Filtering uses the catalog already in memory; keep URL updates local.
    window.history.replaceState(
      null,
      "",
      pathname + (next.size ? "?" + next.toString() : ""),
    );
  }
  const base = entries.filter(
    (p) => track === "all" || p.tracks.includes(track),
  );
  const topicOf = (p: Problem) => p.topics[track] || p.category;
  const orderOf = (p: Problem) =>
    track === "blind-75" ? p.blindOrder : p.order;
  const filtered = base
    .filter(
      (p) =>
        (!topic || topicOf(p) === topic) &&
        (!difficulty || p.difficulty === difficulty) &&
        (!pattern || p.pattern === pattern) &&
        (!availability ||
          (availability === "available"
            ? p.variants.length > 0
            : p.variants.length === 0)) &&
        (!status ||
          (status === "completed"
            ? completed.items.includes("problem:" + p.slug)
            : !completed.items.includes("problem:" + p.slug))) &&
        `${p.title} ${p.signal}`.toLowerCase().includes(term.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title)
        : sort === "difficulty"
          ? ["Easy", "Medium", "Hard"].indexOf(a.difficulty) -
              ["Easy", "Medium", "Hard"].indexOf(b.difficulty) ||
            orderOf(a) - orderOf(b)
          : orderOf(a) - orderOf(b),
    );
  const pageSize = 25,
    pageCount = Math.max(1, Math.ceil(filtered.length / pageSize)),
    page = Math.min(Math.max(1, Number(params.get("page")) || 1), pageCount),
    visible = filtered.slice((page - 1) * pageSize, page * pageSize),
    topics = [
      ...new Set(
        [...base].sort((a, b) => orderOf(a) - orderOf(b)).map(topicOf),
      ),
    ];
  return (
    <>
      <nav className="catalog-track-tabs" aria-label="Practice track">
        {[
          ["all", "All problems", "/practice/"],
          ["blind-75", "Blind 75", "/practice/blind-75/"],
          ["neetcode-150", "NeetCode 150", "/practice/neetcode-150/"],
        ].map(([id, title, href]) => (
          <Link key={id} className={track === id ? "active" : ""} href={href}>
            {title}
            <span>
              {
                entries.filter((p) => id === "all" || p.tracks.includes(id))
                  .length
              }
            </span>
          </Link>
        ))}
      </nav>
      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <span className="sidebar-label">Topics</span>
          <button
            className={!topic ? "selected" : ""}
            onClick={() => change("topic", "")}
          >
            All topics <small>{base.length}</small>
          </button>
          {topics.map((t) => (
            <button
              key={t}
              className={topic === t ? "selected" : ""}
              onClick={() => change("topic", t)}
            >
              {t}
              <small>{base.filter((p) => topicOf(p) === t).length}</small>
            </button>
          ))}
          <div className="sidebar-note">
            <Icon name="idea" />
            <strong>Same problem. One history.</strong>
            <p>
              Shared problems use one completion status across Blind 75 and
              NeetCode 150.
            </p>
          </div>
        </aside>
        <div className="catalog-main">
          <div className="catalog-filters">
            <div className="filter-input">
              <Icon name="search" size={16} />
              <input
                aria-label="Search problems"
                placeholder="Find a problem or a recognition cue…"
                value={term}
                onChange={(event) => change("q", event.target.value)}
              />
            </div>
            <select
              aria-label="Difficulty"
              value={difficulty}
              onChange={(event) => change("difficulty", event.target.value)}
            >
              <option value="">All difficulties</option>
              {["Easy", "Medium", "Hard"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              aria-label="Study material"
              value={availability}
              onChange={(event) => change("availability", event.target.value)}
            >
              <option value="">All availability</option>
              <option value="available">Material available</option>
              <option value="planned">Material planned</option>
            </select>
          </div>
          <div className="catalog-secondary-filters">
            <select
              aria-label="Pattern"
              value={pattern}
              onChange={(event) => change("pattern", event.target.value)}
            >
              <option value="">All patterns</option>
              {patternEntries
                .filter((p) =>
                  base.some((problem) => problem.pattern === p.slug),
                )
                .map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.title} · {p.category}
                  </option>
                ))}
            </select>
            <select
              aria-label="Completion"
              value={status}
              onChange={(event) => change("status", event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Not completed</option>
            </select>
            <select
              aria-label="Sort problems"
              value={sort}
              onChange={(event) => change("sort", event.target.value)}
            >
              <option value="order">Curriculum order</option>
              <option value="title">Title A–Z</option>
              <option value="difficulty">Difficulty</option>
            </select>
            {params.size > 0 && (
              <button
                className="text-link"
                onClick={() => window.history.replaceState(null, "", pathname)}
              >
                Reset filters
              </button>
            )}
          </div>
          <div className="problem-table-wrap">
            <table className="problem-table">
              <thead>
                <tr>
                  <th>
                    <span className="sr-only">Completion</span>
                  </th>
                  <th>Problem</th>
                  <th>Difficulty</th>
                  <th>Pattern</th>
                  <th>Study material</th>
                  <th>
                    <span className="sr-only">Bookmark</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.slug}>
                    <td>
                      <CompletionButton
                        id={"problem:" + p.slug}
                        title={p.title}
                      />
                    </td>
                    <td>
                      <Link
                        className="problem-name"
                        href={`/problems/${p.slug}/`}
                      >
                        {p.title}
                      </Link>
                      <small>
                        {p.tracks
                          .map((t) =>
                            t === "blind-75" ? "Blind 75" : "NeetCode 150",
                          )
                          .join(" · ")}
                      </small>
                    </td>
                    <td>
                      <span
                        className={`difficulty ${p.difficulty.toLowerCase()}`}
                      >
                        {p.difficulty}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/patterns/${p.pattern}/`}
                        className="table-pattern"
                      >
                        {
                          patternEntries.find((x) => x.slug === p.pattern)
                            ?.title
                        }
                      </Link>
                    </td>
                    <td>
                      <span
                        className={`material-status ${p.variants.length ? "available" : ""}`}
                      >
                        {p.variants.length ? "Available" : "Planned"}
                      </span>
                      {p.variants.length > 0 && (
                        <small>
                          {p.variants
                            .map((v) =>
                              v.track === "blind-75" ? "Blind 75" : "NeetCode",
                            )
                            .join(" + ")}
                        </small>
                      )}
                    </td>
                    <td>
                      <BookmarkButton
                        id={"problem:" + p.slug}
                        title={p.title}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visible.length && (
              <div className="empty-state">
                <Icon name="search" size={30} />
                <h3>No matching problems</h3>
                <p>Try a broader search or clear the selected filters.</p>
                <button
                  className="button small"
                  onClick={() =>
                    window.history.replaceState(null, "", pathname)
                  }
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
          <div className="catalog-pagination">
            <span>
              {filtered.length} problems ·{" "}
              {
                base.filter((p) =>
                  completed.items.includes("problem:" + p.slug),
                ).length
              }{" "}
              completed by you
            </span>
            <div>
              <button
                className="icon-button"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => change("page", String(page - 1))}
              >
                <Icon name="back" size={15} />
              </button>
              <span>
                {page} of {pageCount}
              </span>
              <button
                className="icon-button"
                aria-label="Next page"
                disabled={page === pageCount}
                onClick={() => change("page", String(page + 1))}
              >
                <Icon name="arrow" size={15} />
              </button>
            </div>
          </div>
          <div className="practice-note">
            <Icon name="notebook" size={17} />
            <p>
              Availability refers to study material in either track. Each
              problem page preserves the available versions. Personal completion
              starts empty and is saved only in this browser.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
