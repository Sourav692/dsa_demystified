"use client";

import { useEffect, useId, useRef, useState } from "react";

export function Diagram({ source }: { source: string }) {
  const id = useId().replace(/[^a-z0-9]/gi, ""),
    container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("pending");
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    let cancelled = false;
    let observer: IntersectionObserver;
    async function render() {
      try {
        const { default: mermaid } = await import("mermaid");
        if (cancelled) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            fontFamily: "Geist, sans-serif",
            fontSize: "13px",
            primaryColor: "#edf2ff",
            primaryTextColor: "#192331",
            primaryBorderColor: "#7c96e9",
            lineColor: "#8c9cb7",
            secondaryColor: "#f8f9fb",
            tertiaryColor: "#f0f3f8",
          },
        });
        const { svg } = await mermaid.render(`diagram-${id}`, source);
        if (!cancelled) {
          el!.innerHTML = svg;
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          void render();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [source, id]);
  return (
    <figure className="lesson-diagram">
      <div
        ref={container}
        className="diagram-output"
        role="img"
        aria-label="Diagram from the lesson"
      />
      {status === "pending" && (
        <p className="diagram-placeholder">Loading diagram…</p>
      )}
      {status === "error" && (
        <details open>
          <summary>Diagram source</summary>
          <pre>{source}</pre>
        </details>
      )}
      <details className="diagram-source">
        <summary>View diagram text</summary>
        <pre>{source}</pre>
      </details>
    </figure>
  );
}
