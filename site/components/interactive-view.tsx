"use client";
import { useState } from "react";
import { Icon } from "./icons";
export function InteractiveView({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="interactive-view">
      <div className="interactive-view-header">
        <span>
          <Icon name="play" size={16} /> Interactive walkthrough
        </span>
        <a href={src} target="_blank" rel="noreferrer">
          Open full page <Icon name="external" size={14} />
        </a>
      </div>
      {open ? (
        <iframe
          src={src}
          title={`${title} interactive walkthrough`}
          sandbox="allow-scripts allow-downloads"
          loading="lazy"
        />
      ) : (
        <div className="interactive-start">
          <Icon name="path" size={30} />
          <h3>See the algorithm in motion.</h3>
          <p>Open the original step-through alongside your study notes.</p>
          <button
            className="button primary small"
            onClick={() => setOpen(true)}
          >
            <Icon name="play" size={15} /> Load walkthrough
          </button>
        </div>
      )}
    </div>
  );
}
