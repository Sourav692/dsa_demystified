import { Suspense } from "react";
import Link from "next/link";
import { problems, patterns, trackLabel } from "@/lib/library";
import { Breadcrumbs } from "./shell";
import { PracticeCatalog } from "./practice-catalog";
import { Icon } from "./icons";
export function PracticePage({ track = "all" }: { track?: string }) {
  const entries = problems.filter(
    (p) => track === "all" || p.tracks.includes(track),
  );
  const native = entries.filter((p) =>
    p.variants.some((v) => v.track === track),
  ).length;
  return (
    <main id="main-content" className="container">
      <div className="page-heading">
        <Breadcrumbs
          items={[
            ...(track === "all"
              ? []
              : [{ title: "Practice", href: "/practice/" }]),
            { title: track === "all" ? "Practice" : trackLabel(track) },
          ]}
        />
        <div className="heading-with-action">
          <div>
            <h1>
              {track === "all" ? "Practice with a purpose." : trackLabel(track)}
            </h1>
            <p>
              {track === "all"
                ? "Find the pattern, work through the idea, and return to it with confidence."
                : "The complete track catalog, with every available notebook and interactive explanation connected."}
            </p>
            <div className="page-metadata">
              <span>{entries.length} unique problems</span>
              <span>
                {entries.filter((p) => p.variants.length).length} with study
                material
              </span>
              {track !== "all" && (
                <span>
                  {native} native {trackLabel(track)} notebooks
                </span>
              )}
            </div>
          </div>
          <Link className="button" href="/patterns/">
            Explore the patterns <Icon name="arrow" />
          </Link>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="catalog-loading">Loading your practice catalog…</div>
        }
      >
        <PracticeCatalog
          entries={problems}
          patternEntries={patterns}
          track={track}
        />
      </Suspense>
    </main>
  );
}
