import { notFound } from "next/navigation";
import { resources, assetUrl } from "@/lib/library";
import { Breadcrumbs } from "@/components/shell";
import { MarkdownReader } from "@/components/rich-content";
import { InteractiveView } from "@/components/interactive-view";
import { BookmarkButton } from "@/components/preferences";
import { Icon } from "@/components/icons";
export const dynamicParams = false;
export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: resources.find((r) => r.slug === slug)?.title || "Resource" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    r = resources.find((r) => r.slug === slug);
  if (!r) notFound();
  return (
    <main id="main-content" className="container">
      <div className="reading-content">
        <div className="page-heading">
          <Breadcrumbs
            items={[
              { title: "Resources", href: "/resources/" },
              { title: r.title },
            ]}
          />
          <div className="heading-with-action">
            <div>
              <span className="resource-format">
                {r.kind} · {r.format}
              </span>
              <h1>{r.title}</h1>
            </div>
            <BookmarkButton id={"resource:" + r.slug} title={r.title} />
          </div>
          <div className="lesson-resource-links">
            <a href={assetUrl(r.source)} download className="button small">
              <Icon name="download" size={15} />
              Download {r.format}
            </a>
            {r.format !== "MD" && (
              <a
                className="text-link"
                href={assetUrl(r.source)}
                target="_blank"
                rel="noreferrer"
              >
                Open original file <Icon name="external" size={14} />
              </a>
            )}
          </div>
        </div>
        {r.format === "MD" ? (
          <MarkdownReader source={r.source} />
        ) : r.format === "HTML" ? (
          <InteractiveView src={assetUrl(r.source)} title={r.title} />
        ) : r.format === "PNG" ? (
          <img
            className="resource-poster"
            src={assetUrl(r.source)}
            alt={r.title}
          />
        ) : (
          <div className="file-preview">
            <Icon name="notebook" size={40} />
            <h2>{r.format} reference document</h2>
            <p>
              Download the original repository file to read it in your preferred
              document viewer.
            </p>
            <a href={assetUrl(r.source)} download className="button primary">
              <Icon name="download" size={16} />
              Download original
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
