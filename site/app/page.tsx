import Link from "next/link";
import { TreeExplorer } from "@/components/tree-explorer";
import { Icon } from "@/components/icons";
import { treeLessons, repoUrl } from "@/lib/catalog";
import { foundations, patterns, problems, exercises } from "@/lib/library";

export default function Home() {
  return (
    <main id="main-content">
      <div className="container">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">A little intuition goes a long way</p>
            <h1>
              Make algorithms
              <br />
              <span>make sense.</span>
            </h1>
            <p className="hero-intro">
              Build intuition with visual lessons.
              <br />
              Understand the structure. Recognize the pattern.
            </p>
            <div className="actions">
              <Link className="button primary" href="/foundations/">
                Start learning <Icon name="arrow" />
              </Link>
              <Link className="button" href="/practice/">
                Explore problems
              </Link>
            </div>
          </div>
          <TreeExplorer compact />
        </section>
        <section className="home-section">
          <div className="section-heading">
            <h2>A clear path to understanding.</h2>
            <p>Start with the idea. Watch it work. Connect it to a problem.</p>
          </div>
          <div className="home-paths">
            <Link className="home-path" href="/foundations/">
              <span className="path-icon">
                <Icon name="book" size={24} />
              </span>
              <div>
                <h3>Build your foundations</h3>
                <p>
                  Explore the structures and algorithms behind the solutions.
                </p>
                <small>{foundations.length} complete concept tutorials</small>
              </div>
              <Icon name="arrow" />
            </Link>
            <Link className="home-path" href="/patterns/">
              <span className="path-icon">
                <Icon name="path" size={24} />
              </span>
              <div>
                <h3>Recognize the patterns</h3>
                <p>
                  Learn the cues that connect different problems to the same
                  reusable approach.
                </p>
                <small>
                  {patterns.length} patterns ·{" "}
                  {patterns.filter((p) => p.source).length} written explainers
                </small>
              </div>
              <Icon name="arrow" />
            </Link>
            <Link className="home-path" href="/practice/">
              <span className="path-icon">
                <Icon name="code" size={24} />
              </span>
              <div>
                <h3>Practice with intention</h3>
                <p>
                  Apply the ideas to Blind 75 and NeetCode 150, organized by
                  topic and pattern.
                </p>
                <small>
                  {problems.length} unique problems ·{" "}
                  {problems.filter((p) => p.variants.length).length} with study
                  material
                </small>
              </div>
              <Icon name="arrow" />
            </Link>
            <Link className="home-path" href="/company-prep/">
              <span className="path-icon">
                <Icon name="list" size={24} />
              </span>
              <div>
                <h3>Prepare for the conversation</h3>
                <p>
                  Work through practical exercises and explain the trade-offs
                  behind your solution.
                </p>
                <small>
                  {exercises.length} company exercises · Follow-ups & notebooks
                </small>
              </div>
              <Icon name="arrow" />
            </Link>
          </div>
        </section>
        <section className="home-section home-feature">
          <div>
            <h2>
              It starts with
              <br />a simple hierarchy.
            </h2>
            <p>
              A root. A few branches. A set of relationships. Build the mental
              model once, then see how each tree adds a useful constraint.
            </p>
            <Link className="text-link" href="/foundations/trees/">
              Walk through the Trees path <Icon name="arrow" />
            </Link>
          </div>
          <div className="home-lesson-sequence">
            {treeLessons.map((lesson, i) => (
              <Link key={lesson.slug} href={`/foundations/${lesson.slug}/`}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.subtitle}</p>
                </div>
                <Icon name="arrow" />
              </Link>
            ))}
          </div>
        </section>
        <section className="home-section learning-method">
          <div className="section-heading">
            <h2>See the idea. Then make it yours.</h2>
            <p>
              Each lesson connects an explanation to something you can explore.
            </p>
          </div>
          <div className="method-grid">
            <div>
              <Icon name="idea" size={24} />
              <h3>Understand the intuition</h3>
              <p>
                Read the complete tutorial, with diagrams, examples, and the
                reasoning behind the code.
              </p>
            </div>
            <div>
              <Icon name="path" size={24} />
              <h3>Watch the state change</h3>
              <p>
                Inspect a node or step through a traversal. See how the order
                changes the result.
              </p>
            </div>
            <div>
              <Icon name="notebook" size={24} />
              <h3>Run it for yourself</h3>
              <p>
                Download the original notebook and work through the code in your
                own Python environment.
              </p>
            </div>
          </div>
        </section>
        <section className="source-strip">
          <span>
            <Icon name="github" /> Built from a growing, open study repository.
          </span>
          <a href={repoUrl} target="_blank" rel="noreferrer">
            Explore the source <Icon name="external" size={15} />
          </a>
        </section>
      </div>
    </main>
  );
}
