import Link from "next/link";
import { exercises } from "@/lib/library";
import { Breadcrumbs } from "@/components/shell";
import { Icon } from "@/components/icons";
export const metadata = { title: "Company preparation" };
export default function Page() {
  return (
    <main id="main-content" className="container">
      <div className="page-heading">
        <Breadcrumbs items={[{ title: "Company Prep" }]} />
        <h1>
          Bring your thinking
          <br />
          to the interview.
        </h1>
        <p>
          Practice clarifying requirements, choosing a structure, and adapting
          to the follow-up.
        </p>
      </div>
      <section className="company-feature">
        <div>
          <span className="company-wordmark">Atlassian</span>
          <h2>
            Practical problems.
            <br />
            Thoughtful trade-offs.
          </h2>
          <p>
            Explore routing, popularity tracking, file systems, hierarchies, and
            other product-shaped exercises.
          </p>
          <Link className="button primary" href="/company-prep/atlassian/">
            Explore {exercises.length} exercises <Icon name="arrow" />
          </Link>
        </div>
        <div className="company-capabilities">
          {[
            ["code", "Runnable study notebooks"],
            ["idea", "Requirements, hints, and walkthroughs"],
            ["path", "Follow-ups and discussion points"],
          ].map(([name, text]) => (
            <div key={text}>
              <Icon name={name as "code" | "idea" | "path"} size={22} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>
      <p className="independent-note">
        An independent study collection based on the repository’s preparation
        material. No company endorsement is implied.
      </p>
    </main>
  );
}
