import Link from "next/link";
import { notFound } from "next/navigation";
import { patterns, problems, assetUrl } from "@/lib/library";
import { Breadcrumbs } from "@/components/shell";
import { LessonControls, BookmarkButton } from "@/components/preferences";
import { MarkdownReader } from "@/components/rich-content";
import { ProblemList } from "@/components/problem-list";
import { InteractiveView } from "@/components/interactive-view";
import { Icon } from "@/components/icons";
export const dynamicParams = false;
export function generateStaticParams() {
  return patterns.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: patterns.find((p) => p.slug === slug)?.title || "Pattern" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    p = patterns.find((x) => x.slug === slug);
  if (!p) notFound();
  const related = problems.filter((problem) =>
    p.problems.includes(problem.slug),
  );
  return (
    <main id="main-content" className="container">
      <div className="page-heading">
        <Breadcrumbs
          items={[
            { title: "Patterns", href: "/patterns/" },
            { title: p.title },
          ]}
        />
        <div className="heading-with-action">
          <div>
            <h1>{p.title}</h1>
            <p>
              {p.category} · {p.problems.length} related{" "}
              {p.problems.length === 1 ? "problem" : "problems"}
            </p>
          </div>
          {p.source ? (
            <LessonControls slug={"pattern:" + p.slug} title={p.title} />
          ) : (
            <BookmarkButton id={"pattern:" + p.slug} title={p.title} />
          )}
        </div>
      </div>
      <div className="pattern-detail-layout">
        <aside className="curriculum-sidebar">
          <Link className="back-link" href="/patterns/">
            <Icon name="back" size={14} />
            All patterns
          </Link>
          <span className="sidebar-label">{p.category}</span>
          {patterns
            .filter((x) => x.category === p.category)
            .map((x) => (
              <Link
                key={x.slug}
                href={`/patterns/${x.slug}/`}
                className={`sidebar-link ${x.slug === slug ? "selected" : ""}`}
              >
                {x.title}
              </Link>
            ))}
          <div className="sidebar-note">
            <strong>Recognize, then apply.</strong>
            <p>
              Read the cue, explain the template, and try one related problem.
            </p>
          </div>
        </aside>
        <article className="lesson-article">
          <div className="recognition-callout">
            <Icon name="idea" />
            <div>
              <strong>Recognition cues</strong>
              <p>{p.signals.join(" · ")}</p>
            </div>
          </div>
          {p.source ? (
            <MarkdownReader source={p.source} />
          ) : (
            <div className="planned-content compact-planned">
              <h2>This explainer is planned.</h2>
              <p>
                The pattern is cataloged in the NeetCode study plan. Use the
                recognition cues above and explore its problem set below. A
                complete local tutorial is not available yet.
              </p>
            </div>
          )}
          {p.interactive && (
            <InteractiveView src={assetUrl(p.interactive)} title={p.title} />
          )}
          <section className="lesson-next-steps">
            <h2>Put the pattern to work.</h2>
            <p>
              These are the real problems assigned to this pattern in the
              repository.
            </p>
            <ProblemList entries={related} />
          </section>
        </article>
      </div>
    </main>
  );
}
