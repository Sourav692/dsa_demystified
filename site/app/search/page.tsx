import { Suspense } from "react";
import { Breadcrumbs } from "@/components/shell";
import { SearchResults } from "@/components/search-results";
export const metadata = { title: "Search" };
export default function Page() {
  return (
    <main id="main-content" className="container">
      <div className="reading-content">
        <div className="page-heading">
          <Breadcrumbs items={[{ title: "Search" }]} />
          <h1>Find your next idea.</h1>
          <p>
            Search across concepts, patterns, problems, company exercises, and
            resources.
          </p>
        </div>
        <Suspense fallback={<p>Loading search…</p>}>
          <SearchResults />
        </Suspense>
      </div>
    </main>
  );
}
