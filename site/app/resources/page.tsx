import Link from "next/link";
import { resources } from "@/lib/library";
import { Breadcrumbs } from "@/components/shell";
import { Icon } from "@/components/icons";
export const metadata = { title: "Resources" };
export default function Page() {
  return (
    <main id="main-content" className="container">
      <div className="page-heading">
        <Breadcrumbs items={[{ title: "Resources" }]} />
        <h1>Keep the useful things close.</h1>
        <p>
          References, pattern guides, revision tools, and supporting material
          from the repository.
        </p>
      </div>
      {[...new Set(resources.map((r) => r.kind))].map((kind) => (
        <section className="resource-section" key={kind}>
          <h2>
            {kind === "Download"
              ? "Documents & downloads"
              : kind.endsWith("s")
                ? kind
                : kind + "s"}
          </h2>
          <div className="resource-grid">
            {resources
              .filter((r) => r.kind === kind)
              .map((r) => (
                <Link
                  className="resource-card"
                  href={`/resources/${r.slug}/`}
                  key={r.slug}
                >
                  <Icon
                    name={
                      r.format === "MD"
                        ? "book"
                        : r.format === "HTML"
                          ? "path"
                          : "download"
                    }
                    size={25}
                  />
                  <span className="resource-format">{r.format}</span>
                  <h3>{r.title}</h3>
                  <span className="text-link">
                    {r.format === "MD"
                      ? "Read the guide"
                      : r.format === "HTML"
                        ? "Open interactive guide"
                        : "View resource"}
                    <Icon name="arrow" size={14} />
                  </span>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}
