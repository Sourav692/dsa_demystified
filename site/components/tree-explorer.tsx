"use client";

import { useEffect, useState } from "react";
import type { TreeMode } from "@/lib/catalog";
import {
  getNodes,
  nodeInfo,
  traversal,
  searchPath,
  orderDescriptions,
  orderLabels,
  type Order,
} from "@/lib/tree-engine";
import { Icon } from "./icons";

export function TreeExplorer({
  mode = "binary",
  compact = false,
}: {
  mode?: TreeMode;
  compact?: boolean;
}) {
  const [order, setOrder] = useState<Order>(
      mode === "bst" ? "search" : "preorder",
    ),
    [step, setStep] = useState(0),
    [selected, setSelected] = useState(""),
    [playing, setPlaying] = useState(false),
    [target, setTarget] = useState(7);
  const nodes = getNodes(mode),
    search = searchPath(nodes, target),
    sequence = order === "search" ? search.path : traversal(nodes, order),
    maxSteps = sequence.length + (order === "search" && !search.found ? 1 : 0),
    active = step ? sequence[Math.min(step, sequence.length) - 1] : null,
    visited = sequence.slice(0, step),
    finished = step === maxSteps;
  const inspected = nodeInfo(nodes, selected || active || nodes[0].id),
    orders: Order[] =
      mode === "generic"
        ? ["preorder", "postorder", "level"]
        : mode === "bst"
          ? ["search", "inorder", "preorder", "postorder", "level"]
          : ["preorder", "inorder", "postorder", "level"];
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep((current) => {
        if (current >= maxSteps - 1) {
          setPlaying(false);
          return maxSteps;
        }
        return current + 1;
      });
    }, 1100);
    return () => clearInterval(timer);
  }, [playing, maxSteps]);
  function reset() {
    setPlaying(false);
    setStep(0);
    setSelected("");
  }
  function changeOrder(next: Order) {
    setOrder(next);
    reset();
  }
  const message =
    step === 0
      ? orderDescriptions[order]
      : order === "search"
        ? finished && !search.found
          ? `${target} is not in this tree. The next child link is empty.`
          : Number(active) === target
            ? `Found ${target}. The search visited ${sequence.length} nodes along one path.`
            : `${target} ${target < Number(active) ? "<" : ">"} ${active}. Continue into the ${target < Number(active) ? "left" : "right"} subtree.`
        : `Visit ${active}. ${finished ? "Every node has been visited once." : order === "level" ? "Continue across this level before moving deeper." : order === "postorder" ? "Its children have already been processed." : order === "inorder" ? "Its left subtree has already been processed." : "Now continue into its children."}`;
  return (
    <div className={`tree-explorer ${compact ? "compact" : ""}`}>
      <div className="explorer-heading">
        <span>
          <Icon name="tree" size={18} />
          {compact ? "A tree, one step at a time" : "Explore the tree"}
        </span>
        <span className="mono">{nodes.length} nodes</span>
      </div>
      <div className="explorer-tabs" role="group" aria-label="Traversal order">
        {orders
          .filter((_, i) => !compact || i < 3)
          .map((item) => (
            <button
              key={item}
              onClick={() => changeOrder(item)}
              aria-pressed={order === item}
              className={order === item ? "active" : ""}
            >
              {orderLabels[item]}
            </button>
          ))}
      </div>
      {order === "search" && (
        <label className="target-select">
          Find a value
          <select
            aria-label="Search target"
            value={target}
            onChange={(event) => {
              setTarget(Number(event.target.value));
              reset();
            }}
          >
            <option value={7}>7</option>
            <option value={13}>13</option>
            <option value={99}>99 (not present)</option>
          </select>
        </label>
      )}
      <div className="explorer-body">
        <div
          className="tree-canvas"
          aria-label={`${mode === "generic" ? "Generic" : "Binary"} tree. Select a node to inspect it.`}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {nodes.flatMap((parent) =>
              parent.children.map((childId) => {
                const child = nodes.find((n) => n.id === childId)!;
                return (
                  <line
                    key={`${parent.id}-${child.id}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={child.x}
                    y2={child.y}
                    className={
                      visited.includes(parent.id) && visited.includes(child.id)
                        ? "visited-edge"
                        : ""
                    }
                  />
                );
              }),
            )}
          </svg>
          {nodes.map((node) => (
            <button
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`tree-node ${visited.includes(node.id) ? "visited" : ""} ${active === node.id ? "current" : ""} ${selected === node.id ? "selected" : ""} ${order === "search" && finished && search.found && active === node.id ? "found" : ""}`}
              onClick={() => setSelected(node.id)}
              aria-label={`Node ${node.value}${node.id === nodes[0].id ? ", root" : ""}. Inspect depth and height.`}
              aria-pressed={(selected || active || nodes[0].id) === node.id}
            >
              {node.value}
              {node.id === nodes[0].id && (
                <span className="root-label">root</span>
              )}
            </button>
          ))}
        </div>
        {!compact && (
          <div className="node-inspector">
            <span className="small-label">Selected node</span>
            <strong>{inspected.node.value}</strong>
            <dl>
              <div>
                <dt>Parent</dt>
                <dd>{inspected.parent?.value || "None (root)"}</dd>
              </div>
              <div>
                <dt>Depth</dt>
                <dd>{inspected.depth} edges</dd>
              </div>
              <div>
                <dt>Height</dt>
                <dd>{inspected.height} edges</dd>
              </div>
              <div>
                <dt>Children</dt>
                <dd>{inspected.node.children.join(", ") || "None (leaf)"}</dd>
              </div>
            </dl>
            <p>
              Depth counts from the root. Height counts the longest path to a
              leaf.
            </p>
          </div>
        )}
      </div>
      <div className="explorer-output">
        <span className="small-label">
          {order === "search" ? "Search path" : "Visit order"}
        </span>
        <div className="visited-values" aria-live="polite">
          {visited.length ? (
            visited.map((id, i) => (
              <span
                key={`${id}-${i}`}
                className={i === visited.length - 1 ? "latest" : ""}
              >
                {id}
              </span>
            ))
          ) : (
            <span className="output-empty">Press Next to begin.</span>
          )}
        </div>
      </div>
      <p className="explorer-message" role="status">
        {message}
      </p>
      <div className="explorer-controls">
        <div>
          <button
            className="icon-button"
            onClick={reset}
            aria-label="Reset tree walkthrough"
          >
            <Icon name="reset" />
          </button>
          <button
            className="icon-button"
            onClick={() => {
              setPlaying(false);
              setStep(Math.max(0, step - 1));
            }}
            disabled={!step}
            aria-label="Previous tree step"
          >
            <Icon name="previous" />
          </button>
          <button
            className="button small"
            onClick={() => {
              if (finished) setStep(0);
              setPlaying(!playing);
            }}
            aria-label={
              playing ? "Pause tree walkthrough" : "Play tree walkthrough"
            }
          >
            <Icon name={playing ? "pause" : "play"} size={15} />
            {playing ? "Pause" : "Play"}
          </button>
          <button
            className="button small"
            disabled={finished}
            onClick={() => {
              setPlaying(false);
              setStep(Math.min(maxSteps, step + 1));
            }}
            aria-label="Next tree step"
          >
            Next <Icon name="next" size={15} />
          </button>
        </div>
        <span className="step-count mono">
          {step} / {maxSteps}
        </span>
      </div>
    </div>
  );
}
