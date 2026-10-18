import Link from "next/link";
import { exercises, resources } from "@/lib/library";
import { Breadcrumbs } from "@/components/shell";
import { Icon } from "@/components/icons";
import { LessonStatus } from "@/components/preferences";
export const metadata = { title: "Atlassian preparation" };
export default function Page() {
  return (
    <main id="main-content" className="container">
      <div className="page-heading">
        <Breadcrumbs
          items={[
            { title: "Company Prep", href: "/company-prep/" },
            { title: "Atlassian" },
          ]}
        />
        <h1>Atlassian preparation</h1>
        <p>
          Work through the problem. Explain the data structure. Be ready for the
          next requirement.
        </p>
        <div className="page-metadata">
          <span>{exercises.length} source-backed exercises</span>
          <span>Python notebooks</span>
          <span>Follow-up discussions</span>
        </div>
      </div>
      <div className="collection-layout">
        <div className="tree-lesson-list">
          {exercises.map((e, i) => (
            <Link
              className="tree-lesson-card"
              href={`/company-prep/atlassian/${e.slug}/`}
              key={e.slug}
            >
              <span className="chapter-number">{i + 1}</span>
              <div>
                <div className="lesson-card-title">
                  <h2>{e.title}</h2>
                  <LessonStatus slug={"company-exercise:" + e.slug} />
                </div>
                <p>{e.description}</p>
                <div className="lesson-card-meta">
                  <span>Original write-up</span>
                  {e.notebook && <span>Notebook</span>}
                  {e.explanation && <span>Step-by-step trace</span>}
                </div>
              </div>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
        <aside className="roadmap-aside">
          <Icon name="idea" size={24} />
          <h3>Practice the explanation.</h3>
          <p>
            Start with a correct baseline. Identify the slow operation, then
            explain what you would store to improve it.
          </p>
          {resources
            .filter((r) => r.source.startsWith("company_loops"))
            .map((r) => (
              <Link
                key={r.slug}
                className="text-link"
                href={`/resources/${r.slug}/`}
              >
                {r.title} <Icon name="arrow" size={14} />
              </Link>
            ))}
        </aside>
      </div>
    </main>
  );
}
