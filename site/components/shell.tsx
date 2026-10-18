import Link from "next/link";
import { Icon } from "./icons";
import { repoUrl, treeLessons } from "@/lib/catalog";

export function Breadcrumbs({
  items,
}: {
  items: { title: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item, i) => (
        <span key={i}>
          <Icon name="caret" size={11} />
          {item.href ? (
            <Link href={item.href}>{item.title}</Link>
          ) : (
            <span aria-current="page">{item.title}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <Link href="/" className="brand">
            <span className="brand-mark">{"</>"}</span>DSA Demystified
          </Link>
          <div>
            <Link href="/foundations/">Foundations</Link>
            <Link href="/resources/">Resources</Link>
            <Link href="/saved/">Saved</Link>
            <Link href="/roadmap/">Roadmap</Link>
            <a href={repoUrl} target="_blank" rel="noreferrer">
              GitHub <Icon name="external" size={13} />
            </a>
          </div>
        </div>
        <div className="footer-small">
          <span>Understand deeply. Practice deliberately.</span>
          <span>Built from the DSA Demystified study repository.</span>
        </div>
      </div>
    </footer>
  );
}
export function TreeSidebar({ selected }: { selected?: string }) {
  return (
    <aside className="curriculum-sidebar" aria-label="Tree curriculum">
      <Link href="/foundations/" className="back-link">
        <Icon name="back" size={14} /> All foundations
      </Link>
      <div className="sidebar-label">The Trees learning path</div>
      <Link
        href="/foundations/trees/"
        className={`sidebar-link ${!selected ? "selected" : ""}`}
      >
        <Icon name="tree" size={17} /> Overview
      </Link>
      <ol>
        {treeLessons.map((lesson, i) => (
          <li key={lesson.slug}>
            <Link
              href={`/foundations/${lesson.slug}/`}
              className={`sidebar-link ${selected === lesson.slug ? "selected" : ""}`}
              aria-current={selected === lesson.slug ? "page" : undefined}
            >
              <span className="sidebar-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              {lesson.title}
            </Link>
          </li>
        ))}
      </ol>
      <div className="sidebar-note">
        <Icon name="idea" />
        <strong>One idea builds on the next.</strong>
        <p>
          Start with a hierarchy. Add two child links, then an ordering rule.
          Finally, learn how to walk it.
        </p>
      </div>
      <a
        className="source-link"
        href={`${repoUrl}/tree/main/deep_dive`}
        target="_blank"
        rel="noreferrer"
      >
        Explore source material <Icon name="external" size={13} />
      </a>
    </aside>
  );
}
