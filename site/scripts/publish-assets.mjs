import { readFile, mkdir, copyFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const lessons = JSON.parse(
  await readFile(path.join(root, "content/trees.json"), "utf8"),
);
for (const lesson of lessons) {
  const source = path.join(root, "..", "deep_dive", lesson.folder);
  await mkdir(path.join(root, "public/lessons", lesson.folder), {
    recursive: true,
  });
  await mkdir(path.join(root, "public/notebooks"), { recursive: true });
  await copyFile(
    path.join(source, lesson.interactive),
    path.join(root, "public/lessons", lesson.folder, lesson.interactive),
  );
  await copyFile(
    path.join(source, lesson.notebook),
    path.join(root, "public/notebooks", lesson.notebook),
  );
}
console.log(
  `Published ${lessons.length} original interactive lessons and notebooks.`,
);
const catalog = JSON.parse(
  await readFile(path.join(root, "generated/catalog.json"), "utf8"),
);
await rm(path.join(root, "public/content"), { recursive: true, force: true });
for (const source of catalog.assets) {
  const target = path.join(root, "public/content", source);
  await mkdir(path.dirname(target), { recursive: true });
  if (source.endsWith(".html")) {
    const html = await readFile(path.join(root, "..", source), "utf8");
    await writeFile(
      target,
      html.replace(
        /<script\b[^>]*\bsrc=["']https:\/\/static\.cloudflareinsights\.com\/[^"']+["'][^>]*>[\s\S]*?<\/script>/gi,
        "",
      ),
    );
  } else await copyFile(path.join(root, "..", source), target);
}
console.log(
  `Published ${catalog.assets.length} repository assets with their relative paths intact.`,
);
