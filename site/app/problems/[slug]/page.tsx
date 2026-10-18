import Link from "next/link";
import { notFound } from "next/navigation";
import { problems, patterns, trackLabel, assetUrl } from "@/lib/library";
import { readNotebook } from "@/lib/content";
import { Breadcrumbs } from "@/components/shell";
import { LessonControls } from "@/components/preferences";
import { StudyTabs } from "@/components/study-tabs";
import {
  NotebookCells,
  ContentParts,
  MarkdownReader,
  SourceDownloads,
} from "@/components/rich-content";
import { ArticleTools } from "@/components/article-tools";
import { InteractiveView } from "@/components/interactive-view";
import { Icon } from "@/components/icons";
export const dynamicParams = false;
export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: problems.find((p) => p.slug === slug)?.title || "Problem" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    p = problems.find((x) => x.slug === slug);
  if (!p) notFound();
  const pattern = patterns.find((x) => x.slug === p.pattern)!;
  const versions = await Promise.all(
    p.variants.map(async (v) => {
      const notebook = await readNotebook(v.notebook);
      const tabs = [
        ...(notebook.statement
          ? [
              {
                id: "problem",
                title: "Problem",
                content: (
                  <ArticleTools key={"problem-" + v.track}>
                    <ContentParts parts={notebook.statement.parts} />
                  </ArticleTools>
                ),
              },
            ]
          : []),
        {
          id: "notebook",
          title: "Study notebook",
          content: <NotebookCells cells={notebook.cells} />,
        },
        ...(v.explanation
          ? [
              {
                id: "trace",
                title: "Step-by-step trace",
                content: <MarkdownReader source={v.explanation} />,
              },
            ]
          : []),
      ];
      return {
        id: v.track,
        title: trackLabel(v.track),
        content: (
          <>
            <SourceDownloads
              notebook={v.notebook}
              interactive={v.interactive}
              source={v.notebook}
            />
            <div
              className={`problem-workspace ${v.interactive ? "" : "reading-only"}`}
            >
              <section>
                <StudyTabs tabs={tabs} label="Problem material" />
              </section>
              {v.interactive && (
                <aside className="problem-interactive">
                  <InteractiveView
                    src={assetUrl(v.interactive)}
                    title={p.title}
                  />
                  <div className="workspace-note">
                    <Icon name="idea" />
                    <strong>The pattern behind the problem</strong>
                    <p>{p.signal}</p>
                    <Link
                      className="text-link"
                      href={`/patterns/${pattern.slug}/`}
                    >
                      Explore {pattern.title} <Icon name="arrow" size={14} />
                    </Link>
                  </div>
                </aside>
              )}
            </div>
          </>
        ),
      };
    }),
  );
  return (
    <main id="main-content" className="wide-content">
      <div className="page-heading">
        <Breadcrumbs
          items={[
            { title: "Practice", href: "/practice/" },
            { title: p.title },
          ]}
        />
        <div className="heading-with-action">
          <div>
            <h1>{p.title}</h1>
            <div className="page-metadata">
              <span className={`difficulty ${p.difficulty.toLowerCase()}`}>
                {p.difficulty}
              </span>
              <Link href={`/patterns/${pattern.slug}/`}>{pattern.title}</Link>
              <span>{p.tracks.map(trackLabel).join(" · ")}</span>
            </div>
          </div>
          <LessonControls slug={"problem:" + p.slug} title={p.title} />
        </div>
      </div>
      {versions.length ? (
        <StudyTabs tabs={versions} label="Study version" />
      ) : (
        <section className="planned-content">
          <Icon name="notebook" size={30} />
          <h2>Study material is still being built.</h2>
          <p>
            This problem belongs to the NeetCode 150 catalog. A local notebook
            and walkthrough are not available yet.
          </p>
          <div className="actions">
            <a
              href={p.leetcode}
              className="button primary"
              target="_blank"
              rel="noreferrer"
            >
              Solve on LeetCode <Icon name="external" size={16} />
            </a>
            <Link href={`/patterns/${pattern.slug}/`} className="button">
              Explore the pattern
            </Link>
          </div>
        </section>
      )}
      <div className="problem-bottom">
        <a
          href={p.leetcode}
          className="text-link"
          target="_blank"
          rel="noreferrer"
        >
          Original problem on LeetCode <Icon name="external" size={14} />
        </a>
        <Link href="/practice/" className="text-link">
          Back to all problems <Icon name="arrow" size={15} />
        </Link>
      </div>
    </main>
  );
}
