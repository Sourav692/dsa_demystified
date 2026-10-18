import { patterns } from "@/lib/library";
import { Breadcrumbs } from "@/components/shell";
import { PatternBrowser } from "@/components/pattern-browser";
export const metadata = {
  title: "Patterns",
  description:
    "Learn the recognition cues, templates, and traps behind NeetCode 150 patterns.",
};
export default function Page() {
  return (
    <main id="main-content" className="container">
      <div className="page-heading">
        <Breadcrumbs items={[{ title: "Patterns" }]} />
        <h1>
          Different problems.
          <br />
          Familiar patterns.
        </h1>
        <p>
          Learn the cues. Understand the reusable approach. Know when to reach
          for it.
        </p>
        <div className="page-metadata">
          <span>{patterns.length} cataloged patterns</span>
          <span>
            {patterns.filter((p) => p.source).length} written explainers
          </span>
          <span>Linked to actual practice problems</span>
        </div>
      </div>
      <PatternBrowser entries={patterns} />
    </main>
  );
}
