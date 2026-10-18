import catalog from "@/generated/catalog.json";

export interface Foundation {
  slug: string;
  title: string;
  folder: string;
  source: string;
  notebook: string;
  interactive: string;
  group: string;
  description: string;
}
export interface Pattern {
  slug: string;
  title: string;
  category: string;
  source: string | null;
  interactive: string | null;
  signals: string[];
  problems: string[];
}
export interface Variant {
  track: string;
  notebook: string;
  interactive: string | null;
  explanation: string | null;
}
export interface Problem {
  slug: string;
  title: string;
  difficulty: string;
  category: string;
  topics: Record<string, string>;
  pattern: string;
  tracks: string[];
  order: number;
  blindOrder: number;
  leetcode: string;
  signal: string;
  variants: Variant[];
}
export interface Exercise {
  slug: string;
  title: string;
  source: string;
  notebook: string | null;
  explanation: string | null;
  description: string;
}
export interface Resource {
  slug: string;
  title: string;
  source: string;
  format: string;
  kind: string;
}
export const foundations = catalog.foundations as Foundation[];
export const patterns = catalog.patterns as Pattern[];
export const problems = catalog.problems as Problem[];
export const exercises = catalog.exercises as Exercise[];
export const resources = catalog.resources as Resource[];
export const sourceRoutes = catalog.sourceRoutes as Record<string, string>;
export const assetPaths = new Set(catalog.assets);
export const allAssets = catalog.assets;
export const assetUrl = (source: string) =>
  "/content/" + source.split("/").map(encodeURIComponent).join("/");
export const trackLabel = (track: string) =>
  track === "blind-75" ? "Blind 75" : "NeetCode 150";
export const problemPath = (slug: string) => `/problems/${slug}/`;
export const problemId = (slug: string) => `problem:${slug}`;
