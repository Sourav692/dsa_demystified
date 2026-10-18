import Link from "next/link";
import type { Metadata } from "next";
import { foundationGroups, sourceUrl, treeLessons } from "@/lib/catalog";
import { Icon, type IconName } from "@/components/icons";
import { Breadcrumbs } from "@/components/shell";
import { PathProgress } from "@/components/preferences";
import { foundations } from "@/lib/library";

export const metadata: Metadata = {
  title: "Foundations",
  description:
    "Explore the DSA curriculum, starting with the four-part Trees learning path.",
};
export default function Foundations() {
  return (
    <main id="main-content" className="container">
      <div className="page-heading">
        <Breadcrumbs items={[{ title: "Foundations" }]} />
        <h1>
          Strong foundations.
          <br />
          Clear thinking.
        </h1>
        <p>
          Build the mental models that make unfamiliar problems feel familiar.
        </p>
      </div>
      <div className="foundation-layout">
        <aside className="foundation-nav" aria-label="Foundation groups">
          <span className="sidebar-label">The curriculum</span>
          {foundationGroups.map((g) => (
            <a key={g.title} href={`#${g.icon}`}>
              <Icon name={g.icon as IconName} size={17} />
              {g.title}
            </a>
          ))}
          <div className="sidebar-note">
            <Icon name="idea" />
            <strong>Start with Trees.</strong>
            <p>
              All 21 topics are available on the website. Trees is a guided
              introduction to the reading and interactive lessons.
            </p>
          </div>
        </aside>
        <div>
          <section className="featured-path">
            <div>
              <span className="availability">
                <Icon name="check" size={13} /> Ready to explore
              </span>
              <h2>Trees, from the roots up.</h2>
              <p>
                Four connected lessons. One clear progression from hierarchies
                to traversals.
              </p>
              <PathProgress slugs={treeLessons.map((l) => l.slug)} />
            </div>
            <Link className="button primary" href="/foundations/trees/">
              Explore the Trees path <Icon name="arrow" />
            </Link>
          </section>
          {foundationGroups.map((group) => (
            <section
              key={group.title}
              id={group.icon}
              className="foundation-group"
            >
              <div className="group-heading">
                <div>
                  <h2>{group.title}</h2>
                  <p>{group.description}</p>
                </div>
                <span>{group.topics.length} topics</span>
              </div>
              <div className="topic-list">
                {group.topics.map(([title, folder], i) => {
                  const lesson = foundations.find((l) => l.folder === folder);
                  return (
                    <Link
                      href={
                        lesson
                          ? `/foundations/${lesson.slug}/`
                          : sourceUrl(folder)
                      }
                      key={folder}
                      target={lesson ? undefined : "_blank"}
                      rel={lesson ? undefined : "noreferrer"}
                      className="topic-row"
                    >
                      <span className="topic-number">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3>{title}</h3>
                        {lesson && <p>{lesson.description.slice(0, 100)}</p>}
                      </div>
                      <span
                        className={`topic-availability ${lesson ? "on-site" : ""}`}
                      >
                        {lesson ? "Website lesson" : "Read in repository"}
                      </span>
                      <Icon name={lesson ? "arrow" : "external"} size={16} />
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
