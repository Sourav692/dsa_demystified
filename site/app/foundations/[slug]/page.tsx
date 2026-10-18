import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTreeLesson, treeLessons, sourceUrl, repoUrl } from "@/lib/catalog";
import { getLessonContent } from "@/lib/content";
import { Breadcrumbs, TreeSidebar } from "@/components/shell";
import { Icon } from "@/components/icons";
import { TreeExplorer } from "@/components/tree-explorer";
import { LessonControls } from "@/components/preferences";
import { Diagram } from "@/components/diagram";
import { ArticleTools } from "@/components/article-tools";
import { foundations } from "@/lib/library";
import { GeneralFoundation } from "@/components/general-foundation";
import { NotebookSourceLink } from "@/components/rich-content";

export const dynamicParams = false;
export function generateStaticParams() {
  return foundations.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = foundations.find((f) => f.slug === slug);
  return {
    title: lesson?.title || "Lesson not found",
    description: lesson?.description,
  };
}
export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getTreeLesson(slug);
  if (!lesson) {
    const foundation = foundations.find((f) => f.slug === slug);
    if (!foundation) notFound();
    return <GeneralFoundation lesson={foundation} />;
  }
  const { parts, headings } = await getLessonContent(lesson);
  const index = treeLessons.findIndex((l) => l.slug === slug),
    previous = treeLessons[index - 1],
    next = treeLessons[index + 1];
  return (
    <main id="main-content" className="lesson-layout">
      <TreeSidebar selected={slug} />
      <article className="lesson-article">
        <Breadcrumbs
          items={[
            { title: "Foundations", href: "/foundations/" },
            { title: "Trees", href: "/foundations/trees/" },
            { title: lesson.title },
          ]}
        />
        <div className="lesson-topline">
          <span className="lesson-position">Lesson {index + 1} of 4</span>
          <LessonControls slug={slug} title={lesson.title} />
        </div>
        <h1>{lesson.title}</h1>
        <p className="lesson-subtitle">{lesson.subtitle}</p>
        <p className="lesson-description">{lesson.description}</p>
        <div className="page-metadata">
          <span>
            <Icon name="clock" size={15} />
            {lesson.minutes} min read
          </span>
          <span>Python</span>
          <a href={sourceUrl(lesson.folder)} target="_blank" rel="noreferrer">
            Source tutorial <Icon name="external" size={12} />
          </a>
        </div>
        <div className="lesson-resource-links">
          <a
            href={`/notebooks/${lesson.notebook}`}
            download
            className="button small"
          >
            <Icon name="download" size={15} />
            Download notebook
          </a>
          <NotebookSourceLink
            source={`deep_dive/${lesson.folder}/${lesson.notebook}`}
          />
          <a
            className="text-link"
            href={`/lessons/${lesson.folder}/${lesson.interactive}`}
            target="_blank"
            rel="noreferrer"
          >
            Open original interactive lesson <Icon name="external" size={14} />
          </a>
        </div>
        <section className="lesson-outcomes">
          <h2>What you will understand</h2>
          <div>
            {lesson.outcomes.map((outcome) => (
              <p key={outcome}>
                <Icon name="check" size={14} />
                {outcome}
              </p>
            ))}
          </div>
        </section>
        <section id="interactive" className="lesson-interactive">
          <div className="section-heading">
            <h2>Get a feel for the structure.</h2>
            <p>
              {lesson.mode === "bst"
                ? "Search for a value and follow the comparisons. Try a missing target, too."
                : "Inspect a node, then step through the tree. Change the order and compare the result."}
            </p>
          </div>
          <TreeExplorer key={slug} mode={lesson.mode} />
          <p className="convention-note">
            This explorer measures depth and height in edges: root depth 0, leaf
            height 0. The “maximum depth” practice problem below counts nodes
            along a path.
          </p>
        </section>
        <div className="tutorial-heading">
          <h2>The complete deep dive</h2>
          <p>
            Read the original tutorial, with its diagrams, code, and worked
            examples.
          </p>
        </div>
        <ArticleTools key={slug}>
          {parts.map((part, i) =>
            part.kind === "diagram" ? (
              <Diagram key={i} source={part.source} />
            ) : (
              <div key={i} dangerouslySetInnerHTML={{ __html: part.html }} />
            ),
          )}
        </ArticleTools>
        <section id="next-steps" className="lesson-next-steps">
          <h2>Connect the concept to practice.</h2>
          <p>
            Recognize the traversal you need, then apply it to a real problem in
            the repository.
          </p>
          <div className="related-practice">
            <Link href="/patterns/trees-dfs-basics/">
              <span className="path-icon">
                <Icon name="path" />
              </span>
              <div>
                <h3>Tree DFS pattern</h3>
                <p>Recognition cues, recursive shape, and related problems.</p>
              </div>
              <Icon name="external" />
            </Link>
            <Link href="/problems/maximum-depth-of-binary-tree/">
              <span className="path-icon">
                <Icon name="code" />
              </span>
              <div>
                <h3>Maximum Depth of Binary Tree</h3>
                <p>Apply recursion to a classic interview problem.</p>
              </div>
              <Icon name="external" />
            </Link>
          </div>
        </section>
        <div className="lesson-pagination">
          {previous ? (
            <Link href={`/foundations/${previous.slug}/`}>
              <Icon name="back" />
              <span>
                <small>Previous lesson</small>
                {previous.title}
              </span>
            </Link>
          ) : (
            <Link href="/foundations/trees/">
              <Icon name="back" />
              <span>
                <small>The learning path</small>Trees overview
              </span>
            </Link>
          )}
          {next ? (
            <Link
              href={`/foundations/${next.slug}/`}
              className="pagination-next"
            >
              <span>
                <small>Next lesson</small>
                {next.title}
              </span>
              <Icon name="arrow" />
            </Link>
          ) : (
            <Link href="/foundations/trees/" className="pagination-next">
              <span>
                <small>Keep the ideas close</small>Return to the learning path
              </span>
              <Icon name="arrow" />
            </Link>
          )}
        </div>
      </article>
      <aside className="lesson-toc" aria-label="On this page">
        <span className="sidebar-label">On this page</span>
        <a href="#interactive">Interactive walkthrough</a>
        {headings.map((h) => (
          <a key={h.id} href={`#${h.id}`}>
            {h.title}
          </a>
        ))}
        <a href="#next-steps">Related practice</a>
        <div className="toc-download">
          <Icon name="notebook" size={20} />
          <p>Make the code your own.</p>
          <a href={`/notebooks/${lesson.notebook}`} download>
            Get the notebook <Icon name="download" size={13} />
          </a>
        </div>
      </aside>
    </main>
  );
}
