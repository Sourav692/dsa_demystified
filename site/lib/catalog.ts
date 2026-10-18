import data from "@/content/trees.json";
import generatedSearch from "@/generated/search.json";

export const repoUrl = "https://github.com/Sourav692/dsa_demystified";
export type TreeMode = "generic" | "binary" | "bst" | "traversal";
export const treeLessons = data.map((item) => ({
  ...item,
  mode: item.mode as TreeMode,
}));
export type TreeLesson = (typeof treeLessons)[number];
export const getTreeLesson = (slug: string) =>
  treeLessons.find((lesson) => lesson.slug === slug);
export const sourceUrl = (folder: string, file = "README.md") =>
  `${repoUrl}/blob/main/deep_dive/${folder}/${file}`;

export const foundationGroups = [
  {
    title: "Algorithmic foundations",
    description: "The ideas you will use everywhere else.",
    icon: "code",
    topics: [
      ["Hash tables", "16_Hash_Tables"],
      ["Sorting algorithms", "17_Sorting_Algorithms"],
      ["Binary search", "18_Binary_Search"],
      ["Two pointers & sliding window", "19_Two_Pointers_Sliding_Window"],
      ["Greedy algorithms", "20_Greedy_Algorithms"],
      ["Backtracking", "21_Backtracking"],
    ],
  },
  {
    title: "Trees",
    description: "From a simple hierarchy to the orders that make it useful.",
    icon: "tree",
    topics: treeLessons.map((l) => [l.title, l.folder]),
  },
  {
    title: "Specialized structures",
    description: "Reach for the structure that matches the operation.",
    icon: "stack",
    topics: [
      ["Heaps & priority queues", "12_Heaps_Priority_Queues"],
      ["Tries", "13_Tries"],
    ],
  },
  {
    title: "Graph fundamentals",
    description: "Model connections, then learn how to explore them.",
    icon: "graph",
    topics: [
      ["Graph fundamentals", "05_Graph_Fundamentals"],
      ["Graph representation", "06_Graph_Representation"],
      ["Graph traversal", "07_Graph_Traversal"],
    ],
  },
  {
    title: "Advanced graph algorithms",
    description: "Find routes, detect cycles, and untangle dependencies.",
    icon: "path",
    topics: [
      ["Weighted shortest paths", "08_Weighted_Shortest_Paths"],
      ["Minimum spanning tree", "09_Minimum_Spanning_Tree"],
      ["Topological sort", "10_Topological_Sort"],
      ["Cycle detection", "11_Cycle_Detection"],
      ["A* & Floyd–Warshall", "14_AStar_Floyd_Warshall"],
      ["Strongly connected components", "15_Strongly_Connected_Components"],
    ],
  },
];
export const searchEntries = generatedSearch;
