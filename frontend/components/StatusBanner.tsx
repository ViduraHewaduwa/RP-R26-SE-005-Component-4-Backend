// ============================================================================
// StatusBanner Component
// ============================================================================

import styles from "./StatusBanner.module.css";

interface StatusBannerProps {
  type: "success" | "error" | "info" | "loading";
  message: string;
  details?: string[];
}

export default function StatusBanner({ type, message, details }: StatusBannerProps) {
  return (
    <div className={`${styles.banner} ${styles[type]}`}>
      <div className={styles.message}>{message}</div>
      {details && details.length > 0 && (
        <ul className={styles.details}>
          {details.map((detail, idx) => (
            <li key={idx}>{detail}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
