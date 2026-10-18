import assert from "node:assert/strict";
import { readFile, access, readdir } from "node:fs/promises";
import path from "node:path";
import {
  binaryNodes,
  bstNodes,
  genericNodes,
  traversal,
  searchPath,
  nodeInfo,
} from "../lib/tree-engine.ts";

const lessons = JSON.parse(await readFile("content/trees.json", "utf8"));
assert.equal(new Set(lessons.map((l) => l.slug)).size, 4);
for (const lesson of lessons) {
  for (const file of ["README.md", lesson.notebook, lesson.interactive])
    await access(path.join("..", "deep_dive", lesson.folder, file));
  const notebook = JSON.parse(
    await readFile(
      path.join("..", "deep_dive", lesson.folder, lesson.notebook),
      "utf8",
    ),
  );
  assert.ok(notebook.cells.length > 0);
}
assert.deepEqual(traversal(binaryNodes, "preorder"), [
  "1",
  "2",
  "4",
  "5",
  "3",
  "6",
  "7",
]);
assert.deepEqual(traversal(binaryNodes, "inorder"), [
  "4",
  "2",
  "5",
  "1",
  "6",
  "3",
  "7",
]);
assert.deepEqual(traversal(binaryNodes, "postorder"), [
  "4",
  "5",
  "2",
  "6",
  "7",
  "3",
  "1",
]);
assert.deepEqual(traversal(binaryNodes, "level"), [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
]);
assert.deepEqual(traversal(genericNodes, "preorder"), [
  "A",
  "B",
  "E",
  "F",
  "C",
  "G",
  "D",
  "H",
  "I",
]);
assert.deepEqual(traversal(genericNodes, "level"), [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
]);
assert.deepEqual(traversal(bstNodes, "inorder"), [
  "1",
  "3",
  "4",
  "6",
  "7",
  "8",
  "10",
  "13",
  "14",
]);
assert.deepEqual(searchPath(bstNodes, 7), {
  path: ["8", "3", "6", "7"],
  found: true,
});
assert.deepEqual(searchPath(bstNodes, 13), {
  path: ["8", "10", "14", "13"],
  found: true,
});
assert.deepEqual(searchPath(bstNodes, 99), {
  path: ["8", "10", "14"],
  found: false,
});
assert.deepEqual(searchPath([], 7), { path: [], found: false });
assert.deepEqual(traversal([], "preorder"), []);
assert.equal(nodeInfo(genericNodes, "A").height, 3);
assert.equal(nodeInfo(genericNodes, "I").depth, 3);
assert.equal(nodeInfo(genericNodes, "I").height, 0);
assert.equal(nodeInfo(binaryNodes, "2").height, 1);
assert.equal(nodeInfo(binaryNodes, "2").depth, 1);
console.log(
  "Content checks passed: four lesson sources, notebook JSON, traversal orders, BST search paths, and depth/height conventions.",
);

const library = JSON.parse(await readFile("generated/catalog.json", "utf8"));
assert.equal(library.foundations.length, 21);
assert.equal(library.problems.length, 150);
assert.equal(library.patterns.length, 55);
assert.equal(library.exercises.length, 13);
assert.equal(
  library.problems.filter((p) => p.tracks.includes("blind-75")).length,
  75,
);
assert.equal(
  library.problems.filter((p) => p.variants.some((v) => v.track === "blind-75"))
    .length,
  75,
);
const nativeNeetCount = (
  await readdir("../neetcode_150", { recursive: true })
).filter((p) => p.endsWith(".ipynb") && !p.includes("backup")).length;
assert.equal(
  library.problems.filter((p) =>
    p.variants.some((v) => v.track === "neetcode-150"),
  ).length,
  nativeNeetCount,
);
for (const collection of [
  "foundations",
  "problems",
  "patterns",
  "exercises",
  "resources",
])
  assert.equal(
    new Set(library[collection].map((i) => i.slug)).size,
    library[collection].length,
    `${collection} slug collision`,
  );
for (const pattern of library.patterns)
  for (const id of pattern.problems)
    assert.ok(
      library.problems.some((p) => p.slug === id),
      "Pattern references an unknown problem",
    );
for (const source of library.assets) await access(path.join("..", source));
for (const p of library.problems) {
  assert.ok(library.patterns.some((pattern) => pattern.slug === p.pattern));
  assert.equal(new Set(p.tracks).size, p.tracks.length);
  for (const variant of p.variants) {
    const notebook = JSON.parse(
      await readFile(path.join("..", variant.notebook), "utf8"),
    );
    assert.ok(notebook.cells.length > 0);
  }
}
assert.equal(
  library.problems.find((p) => p.slug === "two-sum").variants.length,
  2,
);
assert.equal(
  library.problems.find((p) => p.slug === "add-two-numbers").variants.length,
  0,
);
assert.equal(
  library.problems.find((p) => p.slug === "maximum-depth-of-binary-tree")
    .topics["blind-75"],
  "Tree",
);
console.log(
  `Full catalog checks passed: ${library.assets.length} source assets, unique routes, 75 Blind 75 versions, ${nativeNeetCount} NeetCode versions, planned/available states, and preserved track topics.`,
);
