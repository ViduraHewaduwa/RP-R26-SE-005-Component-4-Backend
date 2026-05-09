// ============================================================================
// JsonBlock Component
// ============================================================================

"use client";

import { useState } from "react";
import styles from "./JsonBlock.module.css";

interface JsonBlockProps {
  data: Record<string, unknown>;
  title?: string;
}

export default function JsonBlock({ data, title }: JsonBlockProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.container}>
      {title && (
        <button
          className={styles.toggle}
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          {expanded ? "▼" : "▶"} {title}
        </button>
      )}
      {(expanded || !title) && (
        <pre className={styles.pre}>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      )}
    </div>
  );
}
