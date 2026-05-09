// ============================================================================
// SectionCard Component
// ============================================================================

import type { ReactNode } from "react";
import styles from "./SectionCard.module.css";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export default function SectionCard({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultExpanded = true,
}: SectionCardProps) {
  if (!collapsible) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }

  return (
    <details className={styles.card} open={defaultExpanded}>
      <summary className={styles.summary}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
