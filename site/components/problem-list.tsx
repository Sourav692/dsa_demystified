import Link from "next/link";
import type { Problem } from "@/lib/library";
import { BookmarkButton, CompletionButton } from "./preferences";
export function ProblemList({ entries }: { entries: Problem[] }) {
  return (
    <div className="problem-table-wrap">
      <table className="problem-table">
        <thead>
          <tr>
            <th>
              <span className="sr-only">Completion</span>
            </th>
            <th>Problem</th>
            <th>Difficulty</th>
            <th>Material</th>
            <th>
              <span className="sr-only">Bookmark</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((p) => (
            <tr key={p.slug}>
              <td>
                <CompletionButton id={"problem:" + p.slug} title={p.title} />
              </td>
              <td>
                <Link className="problem-name" href={`/problems/${p.slug}/`}>
                  {p.title}
                </Link>
                <small>
                  {p.tracks
                    .map((t) =>
                      t === "blind-75" ? "Blind 75" : "NeetCode 150",
                    )
                    .join(" · ")}
                </small>
              </td>
              <td>
                <span className={`difficulty ${p.difficulty.toLowerCase()}`}>
                  {p.difficulty}
                </span>
              </td>
              <td>
                <span
                  className={`material-status ${p.variants.length ? "available" : ""}`}
                >
                  {p.variants.length ? "Available" : "Planned"}
                </span>
              </td>
              <td>
                <BookmarkButton id={"problem:" + p.slug} title={p.title} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
