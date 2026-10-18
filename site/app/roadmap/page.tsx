import Link from "next/link";
import { Breadcrumbs } from "@/components/shell";
import { Icon } from "@/components/icons";
import { resources } from "@/lib/library";
export const metadata = { title: "Learning roadmap" };
export default function Page() {
  const stages = [
    {
      title: "Build the mental models",
      desc: "Start with the Deep Dive concepts. Learn the operations, trace an example, and explain the cost before moving to interview problems.",
      href: "/foundations/",
      action: "Explore Foundations",
      topics: [
        ["Hash tables", "/foundations/hash-tables/"],
        ["Binary search", "/foundations/binary-search/"],
        ["Trees", "/foundations/trees/"],
      ],
    },
    {
      title: "Apply them to Blind 75",
      desc: "Work topic by topic through the classic set. Use the notebook to compare your baseline with the better approach, then explain why it works.",
      href: "/practice/blind-75/",
      action: "Open Blind 75",
      topics: [
        ["Arrays", "/practice/blind-75/?topic=Array"],
        ["Tree problems", "/practice/blind-75/?topic=Tree"],
        ["Sliding window", "/patterns/sliding-window-variable-window/"],
      ],
    },
    {
      title: "Drill patterns with NeetCode 150",
      desc: "Study the recognition cues and template, then solve the problems assigned to the pattern. Shared problems keep the same completion status.",
      href: "/patterns/",
      action: "Explore patterns",
      topics: [
        ["Hash lookup", "/patterns/arrays-and-hashing-hash-lookup/"],
        ["DFS basics", "/patterns/trees-dfs-basics/"],
        ["All 150 problems", "/practice/neetcode-150/"],
      ],
    },
    {
      title: "Revise and practice the conversation",
      desc: "Return to weak topics, revisit bookmarked problems, and work through company exercises with the follow-ups. Explain your assumptions and trade-offs out loud.",
      href: "/company-prep/",
      action: "Explore company preparation",
      topics: [
        ["Saved items", "/saved/"],
        ["Atlassian exercises", "/company-prep/atlassian/"],
        ["Study references", "/resources/"],
      ],
    },
  ];
  const revision = resources.find((r) => r.format === "XLSX");
  return (
    <main id="main-content" className="container">
      <div className="page-heading">
        <Breadcrumbs items={[{ title: "Roadmap" }]} />
        <h1>
          A clear route.
          <br />
          Your own pace.
        </h1>
        <p>
          Follow the repository’s progression: understand the concepts, solve
          the classics, then drill the patterns.
        </p>
      </div>
      <div className="roadmap-layout">
        <div>
          {stages.map((stage, i) => (
            <section className="roadmap-stage" key={stage.title}>
              <span className="roadmap-number">{i + 1}</span>
              <h2>{stage.title}</h2>
              <p>{stage.desc}</p>
              <div className="roadmap-topics">
                {stage.topics.map(([title, href]) => (
                  <Link href={href} key={title}>
                    {title}
                  </Link>
                ))}
              </div>
              <Link className="text-link" href={stage.href}>
                {stage.action}
                <Icon name="arrow" size={16} />
              </Link>
            </section>
          ))}
        </div>
        <aside className="roadmap-aside">
          <Icon name="list" size={25} />
          <h3>Leave room for revision.</h3>
          <p>
            Use the repository’s revision planner to schedule another encounter
            with the ideas you are learning.
          </p>
          {revision && (
            <Link className="text-link" href={`/resources/${revision.slug}/`}>
              Open the revision planner <Icon name="arrow" size={14} />
            </Link>
          )}
          <div className="aside-separator" />
          <p>Prefer the original topic-wise view?</p>
          <Link
            className="text-link"
            href="/resources/original-preparation-roadmap/"
          >
            View the original roadmap <Icon name="arrow" size={14} />
          </Link>
        </aside>
      </div>
    </main>
  );
}
