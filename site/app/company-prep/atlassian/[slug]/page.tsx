import Link from "next/link";
import { notFound } from "next/navigation";
import { exercises } from "@/lib/library";
import { Breadcrumbs } from "@/components/shell";
import {
  MarkdownReader,
  NotebookReader,
  SourceDownloads,
} from "@/components/rich-content";
import { StudyTabs } from "@/components/study-tabs";
import { LessonControls } from "@/components/preferences";
import { Icon } from "@/components/icons";
export const dynamicParams = false;
export function generateStaticParams() {
  return exercises.map((e) => ({ slug: e.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: exercises.find((e) => e.slug === slug)?.title || "Exercise" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    e = exercises.find((e) => e.slug === slug);
  if (!e) notFound();
  const index = exercises.indexOf(e),
    next = exercises[index + 1];
  return (
    <main id="main-content" className="container">
      <div className="reading-content">
        <div className="page-heading">
          <Breadcrumbs
            items={[
              { title: "Company Prep", href: "/company-prep/" },
              { title: "Atlassian", href: "/company-prep/atlassian/" },
              { title: e.title },
            ]}
          />
          <div className="heading-with-action">
            <div>
              <h1>{e.title}</h1>
              <p>{e.description}</p>
            </div>
            <LessonControls
              slug={"company-exercise:" + e.slug}
              title={e.title}
            />
          </div>
          <SourceDownloads notebook={e.notebook} source={e.source} />
        </div>
        <StudyTabs
          tabs={[
            {
              id: "writeup",
              title: "Problem & walkthrough",
              content: <MarkdownReader source={e.source} />,
            },
            ...(e.notebook
              ? [
                  {
                    id: "notebook",
                    title: "Study notebook",
                    content: <NotebookReader source={e.notebook} />,
                  },
                ]
              : []),
            ...(e.explanation
              ? [
                  {
                    id: "trace",
                    title: "Step-by-step trace",
                    content: <MarkdownReader source={e.explanation} />,
                  },
                ]
              : []),
          ]}
        />
        <div className="lesson-pagination">
          <Link href="/company-prep/atlassian/">
            <Icon name="back" />
            All exercises
          </Link>
          {next && (
            <Link href={`/company-prep/atlassian/${next.slug}/`}>
              {next.title}
              <Icon name="arrow" />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
