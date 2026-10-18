import {
  type ContentPart,
  type NotebookCell,
  readNotebook,
  getMarkdownContent,
} from "@/lib/content";
import { Diagram } from "./diagram";
import { ArticleTools } from "./article-tools";
import { assetUrl } from "@/lib/library";
import { repoUrl } from "@/lib/catalog";
import { Icon } from "./icons";

const githubFileUrl = (source: string) =>
  `${repoUrl}/blob/main/${source.split("/").map(encodeURIComponent).join("/")}`;

export function NotebookSourceLink({ source }: { source: string }) {
  return (
    <a
      href={githubFileUrl(source)}
      target="_blank"
      rel="noreferrer"
      className="text-link"
    >
      View notebook on GitHub <Icon name="external" size={13} />
    </a>
  );
}

export function ContentParts({ parts }: { parts: ContentPart[] }) {
  return (
    <>
      {parts.map((part, i) =>
        part.kind === "diagram" ? (
          <Diagram key={i} source={part.source} />
        ) : (
          <div key={i} dangerouslySetInnerHTML={{ __html: part.html }} />
        ),
      )}
    </>
  );
}
export async function MarkdownReader({ source }: { source: string }) {
  const content = await getMarkdownContent(source);
  return (
    <ArticleTools key={source}>
      <ContentParts parts={content.parts} />
    </ArticleTools>
  );
}
export function NotebookCells({ cells }: { cells: NotebookCell[] }) {
  return (
    <ArticleTools>
      <div className="notebook-notice">
        <Icon name="notebook" size={17} />
        <span>
          Source notebook with saved outputs. Python runs in your own notebook
          environment.
        </span>
      </div>
      {cells.map((cell, i) =>
        cell.kind === "markdown" ? (
          <ContentParts key={i} parts={cell.parts} />
        ) : (
          <div className="notebook-cell" key={i}>
            <div className="notebook-cell-label">Python · Cell {i + 1}</div>
            <pre>
              <code>{cell.code}</code>
            </pre>
            {cell.outputs.map((output, j) => (
              <div className="notebook-output" key={j}>
                <span className="small-label">Saved output</span>
                {output.kind === "image" ? (
                  <img
                    src={output.value}
                    alt={`Saved plot from notebook cell ${i + 1}`}
                    loading="lazy"
                  />
                ) : output.kind === "html" ? (
                  <div dangerouslySetInnerHTML={{ __html: output.value }} />
                ) : (
                  <pre>{output.value}</pre>
                )}
              </div>
            ))}
          </div>
        ),
      )}
    </ArticleTools>
  );
}
export async function NotebookReader({ source }: { source: string }) {
  const { cells } = await readNotebook(source);
  return <NotebookCells cells={cells} />;
}
export function SourceDownloads({
  notebook,
  interactive,
  source,
}: {
  notebook?: string | null;
  interactive?: string | null;
  source?: string;
}) {
  return (
    <div className="lesson-resource-links">
      {notebook && (
        <a href={assetUrl(notebook)} download className="button small">
          <Icon name="download" size={15} /> Download notebook
        </a>
      )}
      {notebook && <NotebookSourceLink source={notebook} />}
      {interactive && (
        <a
          href={assetUrl(interactive)}
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          Open interactive lesson <Icon name="external" size={14} />
        </a>
      )}
      {source && source !== notebook && (
        <a
          href={githubFileUrl(source)}
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          View source <Icon name="external" size={13} />
        </a>
      )}
    </div>
  );
}
