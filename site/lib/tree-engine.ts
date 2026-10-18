import type { TreeMode } from "./catalog";

export type Order = "preorder" | "inorder" | "postorder" | "level" | "search";
export type TreeNode = {
  id: string;
  value: string;
  children: string[];
  left?: string;
  right?: string;
  x: number;
  y: number;
};
export const binaryNodes: TreeNode[] = [
  { id: "1", value: "1", children: ["2", "3"], x: 50, y: 13 },
  { id: "2", value: "2", children: ["4", "5"], x: 25, y: 45 },
  { id: "3", value: "3", children: ["6", "7"], x: 75, y: 45 },
  { id: "4", value: "4", children: [], x: 12, y: 78 },
  { id: "5", value: "5", children: [], x: 38, y: 78 },
  { id: "6", value: "6", children: [], x: 62, y: 78 },
  { id: "7", value: "7", children: [], x: 88, y: 78 },
].map((node) => ({ ...node, left: node.children[0], right: node.children[1] }));
export const genericNodes: TreeNode[] = [
  { id: "A", value: "A", children: ["B", "C", "D"], x: 50, y: 9 },
  { id: "B", value: "B", children: ["E", "F"], x: 19, y: 36 },
  { id: "C", value: "C", children: ["G"], x: 50, y: 36 },
  { id: "D", value: "D", children: ["H"], x: 81, y: 36 },
  { id: "E", value: "E", children: [], x: 7, y: 63 },
  { id: "F", value: "F", children: [], x: 30, y: 63 },
  { id: "G", value: "G", children: [], x: 50, y: 63 },
  { id: "H", value: "H", children: ["I"], x: 81, y: 63 },
  { id: "I", value: "I", children: [], x: 81, y: 89 },
];
export const bstNodes: TreeNode[] = [
  { id: "8", value: "8", children: ["3", "10"], x: 52, y: 10 },
  { id: "3", value: "3", children: ["1", "6"], x: 25, y: 35 },
  { id: "10", value: "10", children: ["14"], x: 78, y: 35 },
  { id: "1", value: "1", children: [], x: 10, y: 60 },
  { id: "6", value: "6", children: ["4", "7"], x: 37, y: 60 },
  { id: "14", value: "14", children: ["13"], x: 92, y: 60 },
  { id: "4", value: "4", children: [], x: 28, y: 86 },
  { id: "7", value: "7", children: [], x: 46, y: 86 },
  { id: "13", value: "13", children: [], x: 81, y: 86 },
].map((node) => ({
  ...node,
  left: node.children.find((id) => Number(id) < Number(node.value)),
  right: node.children.find((id) => Number(id) > Number(node.value)),
}));
export function getNodes(mode: TreeMode) {
  return mode === "generic"
    ? genericNodes
    : mode === "bst"
      ? bstNodes
      : binaryNodes;
}
export function nodeInfo(nodes: TreeNode[], id: string) {
  const node = nodes.find((n) => n.id === id)!;
  const parent = nodes.find((n) => n.children.includes(id));
  let depth = 0,
    p = parent;
  while (p) {
    depth++;
    p = nodes.find((n) => n.children.includes(p!.id));
  }
  function height(current: TreeNode): number {
    return current.children.length
      ? 1 +
          Math.max(
            ...current.children.map((child) =>
              height(nodes.find((n) => n.id === child)!),
            ),
          )
      : 0;
  }
  return {
    node,
    parent,
    depth,
    height: height(node),
    leaf: !node.children.length,
  };
}
export function traversal(nodes: TreeNode[], order: Order): string[] {
  const map = new Map(nodes.map((n) => [n.id, n]));
  const result: string[] = [];
  if (!nodes.length) return result;
  if (order === "level") {
    const queue = [nodes[0].id];
    while (queue.length) {
      const id = queue.shift()!;
      result.push(id);
      queue.push(...map.get(id)!.children);
    }
    return result;
  }
  function walk(id: string) {
    const n = map.get(id)!;
    if (order === "preorder") result.push(id);
    if (order === "inorder") {
      if (n.left) walk(n.left);
      result.push(id);
      if (n.right) walk(n.right);
    } else {
      n.children.forEach(walk);
      if (order === "postorder") result.push(id);
    }
  }
  walk(nodes[0].id);
  return result;
}
export function searchPath(
  nodes: TreeNode[],
  target: number,
): { path: string[]; found: boolean } {
  const path: string[] = [];
  let current: TreeNode | undefined = nodes[0];
  while (current) {
    path.push(current.id);
    const value = Number(current.value);
    if (value === target) return { path, found: true };
    const nextId: string | undefined =
      target < value ? current.left : current.right;
    current = nodes.find((node: TreeNode): boolean => node.id === nextId);
  }
  return { path, found: false };
}
export const orderLabels: Record<Order, string> = {
  preorder: "Preorder",
  inorder: "Inorder",
  postorder: "Postorder",
  level: "Level order",
  search: "BST search",
};
export const orderDescriptions: Record<Order, string> = {
  preorder: "Visit the node, then explore its children from left to right.",
  inorder:
    "Explore the left subtree, visit the node, then explore the right subtree.",
  postorder: "Explore the children first, then visit the node on the way back.",
  level: "Visit nodes one level at a time, using a first-in, first-out queue.",
  search:
    "Compare at each node. Keep the subtree that could still contain the target.",
};
