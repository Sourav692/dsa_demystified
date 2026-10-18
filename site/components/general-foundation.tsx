import Link from "next/link";
import {
  foundations,
  patterns,
  type Foundation,
  assetUrl,
} from "@/lib/library";
import { getMarkdownContent } from "@/lib/content";
import { Breadcrumbs } from "./shell";
import { LessonControls } from "./preferences";
import { ContentParts, SourceDownloads } from "./rich-content";
import { ArticleTools } from "./article-tools";
import { InteractiveView } from "./interactive-view";
import { Icon } from "./icons";
export async function GeneralFoundation({ lesson }: { lesson: Foundation }) {
  const content = await getMarkdownContent(lesson.source),
    siblings = foundations.filter((f) => f.group === lesson.group),
    index = siblings.findIndex((f) => f.slug === lesson.slug);
  const related = patterns
    .filter(
      (p) =>
        p.source &&
        (lesson.group.includes("Graph") || lesson.group.includes("graph")
          ? p.category.includes("Graph")
          : lesson.title
              .toLowerCase()
              .includes(p.category.toLowerCase().split(" ")[0])),
    )
    .slice(0, 3);
  return (
    <main id="main-content" className="lesson-layout">
      <aside className="curriculum-sidebar" aria-label="Foundation curriculum">
        <Link className="back-link" href="/foundations/">
          <Icon name="back" size={14} />
          All foundations
        </Link>
        {[...new Set(foundations.map((f) => f.group))].map((group) => (
          <div key={group}>
            <span className="sidebar-label">{group}</span>
            {foundations
              .filter((f) => f.group === group)
              .map((f) => (
                <Link
                  key={f.slug}
                  className={`sidebar-link ${f.slug === lesson.slug ? "selected" : ""}`}
                  href={`/foundations/${f.slug}/`}
                >
                  {f.title}
                </Link>
              ))}
          </div>
        ))}
      </aside>
      <article className="lesson-article">
        <Breadcrumbs
          items={[
            { title: "Foundations", href: "/foundations/" },
            { title: lesson.title },
          ]}
        />
        <div className="lesson-topline">
          <span className="lesson-position">{lesson.group}</span>
          <LessonControls slug={lesson.slug} title={lesson.title} />
        </div>
        <h1>{lesson.title}</h1>
        <p className="lesson-description">{lesson.description}</p>
        <SourceDownloads
          notebook={lesson.notebook}
          interactive={lesson.interactive}
          source={lesson.source}
        />
        <section id="interactive">
          <InteractiveView
            src={assetUrl(lesson.interactive)}
            title={lesson.title}
          />
        </section>
        <ArticleTools key={lesson.slug}>
          <ContentParts parts={content.parts} />
        </ArticleTools>
        {related.length > 0 && (
          <section className="lesson-next-steps">
            <h2>Connect the idea to a pattern.</h2>
            <div className="related-practice">
              {related.map((p) => (
                <Link key={p.slug} href={`/patterns/${p.slug}/`}>
                  <span className="path-icon">
                    <Icon name="path" />
                  </span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.category}</p>
                  </div>
                  <Icon name="arrow" />
                </Link>
              ))}
            </div>
          </section>
        )}
        <div className="lesson-pagination">
          <Link
            href={
              index
                ? `/foundations/${siblings[index - 1].slug}/`
                : "/foundations/"
            }
          >
            <Icon name="back" />
            <span>
              <small>Previous</small>
              {index ? siblings[index - 1].title : "All foundations"}
            </span>
          </Link>
          <Link
            href={
              siblings[index + 1]
                ? `/foundations/${siblings[index + 1].slug}/`
                : "/practice/"
            }
            className="pagination-next"
          >
            <span>
              <small>Next step</small>
              {siblings[index + 1]?.title || "Put it into practice"}
            </span>
            <Icon name="arrow" />
          </Link>
        </div>
      </article>
      <aside className="lesson-toc" aria-label="On this page">
        <span className="sidebar-label">On this page</span>
        <a href="#interactive">Interactive lesson</a>
        {content.headings.map((h) => (
          <a key={h.id} href={`#${h.id}`}>
            {h.title}
          </a>
        ))}
      </aside>
    </main>
  );
}
