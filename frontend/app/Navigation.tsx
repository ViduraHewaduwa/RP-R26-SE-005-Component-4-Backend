"use client";

import { usePathname, useRouter } from "next/navigation";
import { clearWorkspace } from "@/lib/storage";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleReset = () => {
    if (confirm("Are you sure you want to clear all local workspace data? This cannot be undone.")) {
      clearWorkspace();
      router.push("/dashboard");
      window.location.reload();
    }
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "■" },
    { path: "/sprint", label: "Sprint", icon: "▶" },
    { path: "/team", label: "Team", icon: "●" },
    { path: "/analytics", label: "Analytics", icon: "▲" },
    { path: "/setup", label: "Setup", icon: "◆" },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.logo}>💰</span>
          <span className={styles.brandName}>Sprint Cost Studio</span>
        </div>

        <div className={styles.links}>
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`${styles.link} ${pathname === item.path ? styles.active : ""}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        <button className={styles.resetButton} onClick={handleReset} title="Reset Workspace">
          🗑️
        </button>
      </div>
    </nav>
  );
}
