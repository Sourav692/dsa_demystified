import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  TreeStructure,
  BookOpenText,
  Code,
  Graph,
  Stack,
  Path,
  Check,
  Clock,
  CaretRight,
  GithubLogo,
  Notebook,
  Lightning,
  ListChecks,
  MagnifyingGlass,
  Moon,
  Sun,
  BookmarkSimple,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ArrowCounterClockwise,
  X,
  Copy,
  CheckCircle,
  DownloadSimple,
  ArrowsOut,
  Lightbulb,
} from "@phosphor-icons/react/dist/ssr";

const icons = {
  arrow: ArrowRight,
  external: ArrowUpRight,
  back: ArrowLeft,
  tree: TreeStructure,
  book: BookOpenText,
  code: Code,
  graph: Graph,
  stack: Stack,
  path: Path,
  check: Check,
  clock: Clock,
  caret: CaretRight,
  github: GithubLogo,
  notebook: Notebook,
  lightning: Lightning,
  list: ListChecks,
  search: MagnifyingGlass,
  moon: Moon,
  sun: Sun,
  bookmark: BookmarkSimple,
  play: Play,
  pause: Pause,
  next: SkipForward,
  previous: SkipBack,
  reset: ArrowCounterClockwise,
  close: X,
  copy: Copy,
  complete: CheckCircle,
  download: DownloadSimple,
  expand: ArrowsOut,
  idea: Lightbulb,
};
export type IconName = keyof typeof icons;
export function Icon({
  name,
  size = 18,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const Component = icons[name];
  return (
    <Component
      size={size}
      weight="regular"
      aria-hidden="true"
      className={className}
    />
  );
}
