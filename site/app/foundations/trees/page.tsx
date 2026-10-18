import Link from "next/link";
import type { Metadata } from "next";
import { treeLessons } from "@/lib/catalog";
import { Breadcrumbs, TreeSidebar } from "@/components/shell";
import { Icon } from "@/components/icons";
import { TreeExplorer } from "@/components/tree-explorer";
import { LessonStatus, PathProgress } from "@/components/preferences";

export const metadata: Metadata = {
  title: "Trees learning path",
  description:
    "Learn generic trees, binary trees, binary search trees, and tree traversals through four complete lessons.",
};
export default function Trees() {
  return (
    <main id="main-content" className="container">
      <div className="page-heading">
        <Breadcrumbs
          items={[
            { title: "Foundations", href: "/foundations/" },
            { title: "Trees" },
          ]}
        />
        <div className="heading-with-action">
          <div>
            <span className="eyebrow">The Trees learning path</span>
            <h1>
              Start at the root.
              <br />
              See the whole tree.
            </h1>
            <p>Learn the structure once. Build on it, one idea at a time.</p>
            <div className="page-metadata">
              <span>
                <Icon name="book" size={15} /> 4 lessons
              </span>
              <span>
                <Icon name="clock" size={15} /> About 1 hr 45 min
              </span>
              <span>Python</span>
            </div>
          </div>
          <Link className="button primary" href="/foundations/generic-trees/">
            Begin the first lesson <Icon name="arrow" />
          </Link>
        </div>
      </div>
      <div className="trees-layout">
        <TreeSidebar />
        <div>
          <div className="path-intro">
            <h2>One family. Four useful ideas.</h2>
            <p>
              A generic tree describes a hierarchy. A binary tree limits each
              node to two children. A BST adds an ordering rule. Traversal gives
              you a way to visit them all.
            </p>
            <PathProgress slugs={treeLessons.map((l) => l.slug)} />
          </div>
          <div className="tree-lesson-list">
            {treeLessons.map((lesson, i) => (
              <Link
                className="tree-lesson-card"
                href={`/foundations/${lesson.slug}/`}
                key={lesson.slug}
              >
                <span className="chapter-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="lesson-card-title">
                    <h2>{lesson.title}</h2>
                    <LessonStatus slug={lesson.slug} />
                  </div>
                  <p>{lesson.description}</p>
                  <div className="lesson-card-meta">
                    <span>{lesson.minutes} min</span>
                    <span>Interactive walkthrough</span>
                    <span>Notebook included</span>
                  </div>
                </div>
                <Icon name="arrow" />
              </Link>
            ))}
          </div>
          <section className="path-explorer-preview">
            <div className="section-heading">
              <h2>A small tree. A useful mental model.</h2>
              <p>
                Try changing the traversal order. Select a node to inspect its
                place in the tree.
              </p>
            </div>
            <TreeExplorer mode="binary" />
          </section>
          <section className="path-outcomes">
            <h2>By the end, you can…</h2>
            <div>
              {[
                "Explain roots, leaves, depth, height, and subtrees.",
                "Recognize the difference between a binary tree and a BST.",
                "Choose a traversal order that fits the task.",
                "Explain why balance changes the cost of a search.",
              ].map((text) => (
                <p key={text}>
                  <Icon name="check" size={17} />
                  {text}
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
