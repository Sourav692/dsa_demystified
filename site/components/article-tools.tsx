"use client";

import { useEffect, useRef, useState } from "react";

export function ArticleTools({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const buttons: HTMLButtonElement[] = [];
    ref.current?.querySelectorAll("pre > code").forEach((code) => {
      if (code.closest(".lesson-diagram")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "code-copy";
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code example");
      button.dataset.copy = "true";
      code.parentElement?.append(button);
      buttons.push(button);
    });
    return () => buttons.forEach((b) => b.remove());
  }, []);
  return (
    <div
      ref={ref}
      className="article-content"
      onClick={async (event) => {
        const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
          "[data-copy]",
        );
        if (!button) return;
        const code = button.closest("pre")?.querySelector("code");
        if (!code) return;
        try {
          await navigator.clipboard.writeText(code.textContent || "");
          button.textContent = "Copied";
          setNotice("Code copied to clipboard.");
        } catch {
          setNotice("Select the code and copy it using your keyboard.");
        }
      }}
    >
      {children}
      <span className="copy-notice" role="status">
        {notice}
      </span>
    </div>
  );
}
