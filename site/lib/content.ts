import fs from "node:fs/promises";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeParse from "rehype-parse";
import { visit } from "unist-util-visit";
import type { Element, Root, RootContent } from "hast";
import type { TreeLesson } from "./catalog";
import { sourceRoutes, assetPaths, assetUrl } from "./library";

export type ContentPart =
  { kind: "html"; html: string } | { kind: "diagram"; source: string };
function textOf(node: RootContent): string {
  if (node.type === "text") return node.value;
  return "children" in node
    ? node.children.map((c) => textOf(c as RootContent)).join("")
    : "";
}
function resolveLink(href: string, source: string) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [pathname, fragment] = href.split("#");
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const resolved = path.posix.normalize(
    path.posix.join(path.posix.dirname(source), decoded),
  );
  if (sourceRoutes[resolved]) return sourceRoutes[resolved];
  if (assetPaths.has(resolved))
    return assetUrl(resolved) + (fragment ? "#" + fragment : "");
  return null;
}

export async function getLessonContent(lesson: TreeLesson) {
  let markdown = await fs.readFile(
    path.join(process.cwd(), "..", "deep_dive", lesson.folder, "README.md"),
    "utf8",
  );
  // The website supplies its own title and context; keep the technical tutorial.
  markdown = markdown
    .replace(/^# .+\n/, "")
    .replace(/^>.*Atlassian_Prep.*\n/gm, "");
  markdown = markdown.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "");
  // Correct two presentation-only inaccuracies without modifying the source files:
  // an unbalanced BST does not guarantee halving, and the shown search visits four nodes.
  if (lesson.mode === "bst") {
    markdown = markdown.replace(
      /at each node you can throw away \*\*half\*\* the tree\.[\s\S]*?on a tree\./,
      "at each node you can rule out **one entire subtree**. Smaller than me? Go left. Bigger? Go right. The cost is **O(h)**: **O(log n)** when balanced and **O(n)** when skewed. A subtree is not necessarily half the remaining nodes.",
    );
    markdown = markdown.replace(
      "Just **3 comparisons** in an 8-node tree.",
      "Visits **4 nodes** along one root-to-target path.",
    );
  }
  return renderMarkdown(markdown, `deep_dive/${lesson.folder}/README.md`);
}

export async function getMarkdownContent(source: string) {
  const markdown = await fs.readFile(
    path.join(process.cwd(), "..", source),
    "utf8",
  );
  return renderMarkdown(markdown.replace(/^# .+\n/, ""), source);
}
export async function renderMarkdown(
  markdown: string,
  source: string,
  prefix = "",
) {
  markdown = markdown.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "");
  const diagrams: string[] = [],
    headings: { id: string; title: string }[] = [];
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeSlug)
    .use(() => (tree: Root) => {
      visit(tree, "element", (node: Element, index, parent) => {
        if (node.tagName === "a" && typeof node.properties.href === "string") {
          const resolved = resolveLink(node.properties.href, source);
          if (resolved) node.properties.href = resolved;
          else {
            node.tagName = "span";
            node.properties = {
              className: ["unavailable-source-link"],
              title: "This reference is not included in the published content.",
            };
          }
          if (String(node.properties.href).startsWith("https://")) {
            node.properties.target = "_blank";
            node.properties.rel = ["noopener", "noreferrer"];
          }
        }
        if (/^h[1-6]$/.test(node.tagName) && prefix)
          node.properties.id = prefix + node.properties.id;
        if (
          node.tagName === "img" &&
          typeof node.properties.src === "string" &&
          !node.properties.src.startsWith("https:")
        ) {
          const resolved = resolveLink(node.properties.src, source);
          if (resolved) node.properties.src = resolved;
        }
        if (node.tagName === "h2")
          headings.push({
            id: String(node.properties.id),
            title: textOf(node).replace(/^\d+\.\s*/, ""),
          });
        if (node.tagName !== "pre" || index === undefined || !parent) return;
        const code = node.children[0];
        if (
          code?.type !== "element" ||
          !(code.properties.className as string[] | undefined)?.includes(
            "language-mermaid",
          )
        )
          return;
        // Mermaid reserves "end"; normalize the legacy class name only in the rendered copy.
        const diagramSource = textOf(code)
          .replace(/\bclassDef\s+end\b/g, "classDef terminalNode")
          .replace(/:::end\b/g, ":::terminalNode");
        const diagramIndex = diagrams.push(diagramSource) - 1;
        parent.children[index] = {
          type: "element",
          tagName: "div",
          properties: { "data-lesson-diagram": String(diagramIndex) },
          children: [],
        };
      });
    })
    .use(rehypeStringify)
    .process(markdown);
  const chunks = String(result).split(
    /<div data-lesson-diagram="(\d+)"><\/div>/,
  );
  const parts: ContentPart[] = chunks.map((chunk, i) =>
    i % 2
      ? { kind: "diagram", source: diagrams[Number(chunk)] }
      : { kind: "html", html: chunk },
  );
  return { parts, headings };
}

export async function sanitizeOutput(html: string) {
  return String(
    await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(html),
  );
}
export type NotebookOutput = { kind: "text" | "html" | "image"; value: string };
export type NotebookCell =
  | { kind: "markdown"; parts: ContentPart[] }
  | { kind: "code"; code: string; outputs: NotebookOutput[] };
export async function readNotebook(source: string) {
  const notebook = JSON.parse(
    await fs.readFile(path.join(process.cwd(), "..", source), "utf8"),
  );
  const cells: NotebookCell[] = await Promise.all(
    notebook.cells.map(
      async (
        cell: {
          cell_type: string;
          source: string[] | string;
          outputs?: {
            text?: string[] | string;
            data?: Record<string, string[] | string>;
            traceback?: string[];
          }[];
        },
        index: number,
      ) => {
        const text = Array.isArray(cell.source)
          ? cell.source.join("")
          : cell.source;
        if (cell.cell_type === "markdown") {
          const { parts } = await renderMarkdown(
            index === 0 ? text.replace(/^# .+\n/, "") : text,
            source,
            `cell-${index}-`,
          );
          return { kind: "markdown" as const, parts };
        }
        const outputs: NotebookOutput[] = [];
        const join = (value: string[] | string) =>
          Array.isArray(value) ? value.join("") : value;
        for (const output of cell.outputs || []) {
          if (output.data?.["image/png"])
            outputs.push({
              kind: "image",
              value:
                "data:image/png;base64," +
                join(output.data["image/png"]).replace(/\s/g, ""),
            });
          else if (output.data?.["text/html"])
            outputs.push({
              kind: "html",
              value: await sanitizeOutput(join(output.data["text/html"])),
            });
          else if (output.text)
            outputs.push({ kind: "text", value: join(output.text) });
          else if (output.data?.["text/plain"])
            outputs.push({
              kind: "text",
              value: join(output.data["text/plain"]),
            });
          else if (output.traceback)
            outputs.push({
              kind: "text",
              value: output.traceback.join("\n").replace(/\x1b\[[0-9;]*m/g, ""),
            });
        }
        return { kind: "code" as const, code: text, outputs };
      },
    ),
  );
  const problemCell = notebook.cells.find(
    (c: { cell_type: string; source: string[] | string }) =>
      c.cell_type === "markdown" &&
      /^##\s*[^\n]*(?:Problem|Statement)/im.test(
        Array.isArray(c.source) ? c.source.join("") : c.source,
      ),
  );
  const statement = problemCell
    ? await renderMarkdown(
        Array.isArray(problemCell.source)
          ? problemCell.source.join("")
          : problemCell.source,
        source,
        "statement-",
      )
    : null;
  return { cells, statement };
}
