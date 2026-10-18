"use client";

import { useSyncExternalStore, useState, useEffect } from "react";
import { Icon } from "./icons";

const memory = new Map<string, string>();
const eventName = "dsa-website-preferences";
function read(key: string) {
  try {
    return localStorage.getItem(key) || memory.get(key) || "[]";
  } catch {
    return memory.get(key) || "[]";
  }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(eventName, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(eventName, callback);
  };
}
export function useList(name: string) {
  const key = `dsa-website-${name}`,
    raw = useSyncExternalStore(
      subscribe,
      () => read(key),
      () => "[]",
    );
  let items: string[] = [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed))
      items = parsed.filter((x) => typeof x === "string");
  } catch {}
  const toggle = (id: string) => {
    const updated = items.includes(id)
      ? items.filter((x) => x !== id)
      : [...items, id];
    const value = JSON.stringify(updated);
    memory.set(key, value);
    try {
      localStorage.setItem(key, value);
    } catch {}
    window.dispatchEvent(new Event(eventName));
  };
  const clear = () => {
    memory.set(key, "[]");
    try {
      localStorage.setItem(key, "[]");
    } catch {}
    window.dispatchEvent(new Event(eventName));
  };
  return { items, toggle, clear };
}
export function BookmarkButton({ id, title }: { id: string; title: string }) {
  const saved = useList("saved");
  const active = saved.items.includes(id);
  return (
    <button
      className={`icon-button ${active ? "is-saved" : ""}`}
      aria-label={`${active ? "Remove bookmark" : "Bookmark"} ${title}`}
      aria-pressed={active}
      onClick={() => saved.toggle(id)}
    >
      <Icon name="bookmark" size={16} />
    </button>
  );
}
export function CompletionButton({ id, title }: { id: string; title: string }) {
  const completed = useList("completed"),
    active = completed.items.includes(id);
  return (
    <button
      className={`completion-button ${active ? "is-complete" : ""}`}
      aria-label={`${active ? "Mark incomplete" : "Mark complete"} ${title}`}
      aria-pressed={active}
      onClick={() => completed.toggle(id)}
    >
      {active && <Icon name="check" size={12} />}
    </button>
  );
}
export function LessonControls({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const saved = useList("saved"),
    complete = useList("completed");
  return (
    <div className="lesson-controls">
      <button
        className={`icon-button ${saved.items.includes(slug) ? "is-saved" : ""}`}
        onClick={() => saved.toggle(slug)}
        aria-label={`${saved.items.includes(slug) ? "Remove bookmark" : "Bookmark"} ${title}`}
        aria-pressed={saved.items.includes(slug)}
      >
        <Icon name="bookmark" />
      </button>
      <button
        className={`button small ${complete.items.includes(slug) ? "is-complete" : ""}`}
        onClick={() => complete.toggle(slug)}
        aria-pressed={complete.items.includes(slug)}
      >
        <Icon name={complete.items.includes(slug) ? "complete" : "check"} />
        {complete.items.includes(slug) ? "Completed" : "Mark complete"}
      </button>
    </div>
  );
}
export function LessonStatus({ slug }: { slug: string }) {
  const { items } = useList("completed");
  return items.includes(slug) ? (
    <span className="completion-label">
      <Icon name="complete" size={15} /> Completed
    </span>
  ) : null;
}
export function PathProgress({ slugs }: { slugs: string[] }) {
  const { items } = useList("completed");
  const count = slugs.filter((id) => items.includes(id)).length;
  return (
    <span className="path-progress">
      <Icon name="complete" size={16} />
      {count} of {slugs.length} lessons completed
      <span className="progress-segments" aria-hidden="true">
        {slugs.map((id) => (
          <i key={id} className={items.includes(id) ? "filled" : ""} />
        ))}
      </span>
    </span>
  );
}
export function ThemeButton() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "light");
  }, []);
  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("dsa-website-theme", next);
    } catch {}
    window.dispatchEvent(new Event("dsa-theme"));
  }
  return (
    <button
      className="icon-button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      <Icon name={theme === "light" ? "moon" : "sun"} />
    </button>
  );
}
