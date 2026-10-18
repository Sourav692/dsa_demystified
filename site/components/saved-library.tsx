"use client";
import Link from "next/link";
import { searchEntries } from "@/lib/catalog";
import { useList, BookmarkButton } from "./preferences";
import { Icon } from "./icons";
export function SavedLibrary() {
  const saved = useList("saved"),
    completed = useList("completed");
  const entries = searchEntries.filter((e) => saved.items.includes(e.id));
  return (
    <>
      <div className="saved-summary">
        <span>
          {entries.length} saved items · {completed.items.length} completed
          items
        </span>
        {entries.length > 0 && (
          <button className="text-link" onClick={saved.clear}>
            Clear bookmarks
          </button>
        )}
      </div>
      {entries.length ? (
        <div className="saved-list">
          {entries.map((e) => (
            <div className="saved-row" key={e.id}>
              <span className="path-icon">
                <Icon name="bookmark" />
              </span>
              <Link href={e.href}>
                <small>{e.kind}</small>
                <h2>{e.title}</h2>
                <p>{e.description}</p>
              </Link>
              <BookmarkButton id={e.id} title={e.title} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name="bookmark" size={35} />
          <h2>A place for the ideas you want to revisit.</h2>
          <p>
            Use the bookmark icon on a lesson, pattern, problem, or resource.
          </p>
          <Link className="button primary" href="/foundations/">
            Find a starting point <Icon name="arrow" />
          </Link>
        </div>
      )}
      <div className="practice-note">
        <Icon name="idea" />
        <p>
          Saved items and completion are local to this browser. Clearing browser
          storage removes them. No account is required.
        </p>
      </div>
      <div className="saved-reset">
        <span>Want a fresh start?</span>
        <button className="text-link" onClick={completed.clear}>
          Reset completion history
        </button>
      </div>
    </>
  );
}
