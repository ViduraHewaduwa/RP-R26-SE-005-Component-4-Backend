"use client";

import { useState, useEffect } from "react";
import SectionCard from "@/components/SectionCard";
import Button from "@/components/Button";
import styles from "./page.module.css";
import WorkspaceSummary from "./components/WorkspaceSummary";
import SkillsSection from "./components/SkillsSection";
import TeamsSection from "./components/TeamsSection";
import DevelopersSection from "./components/DevelopersSection";
import SprintsSection from "./components/SprintsSection";
import TasksSection from "./components/TasksSection";
import AssignmentsSection from "./components/AssignmentsSection";
import AnalyticsSection from "./components/AnalyticsSection";
import PredictionsSection from "./components/PredictionsSection";
import { clearWorkspace } from "@/lib/storage";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReset = () => {
    if (confirm("Are you sure you want to clear all local workspace data? This cannot be undone.")) {
      clearWorkspace();
      setRefreshKey((k) => k + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Sprint Cost Studio</h1>
          <p className={styles.subtitle}>
            Build sprint planning data and run cost predictions
          </p>
        </div>
        <Button variant="danger" size="sm" onClick={handleReset}>
          Reset Workspace
        </Button>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <WorkspaceSummary key={refreshKey} />
        </aside>

        <main className={styles.main}>
          <nav className={styles.progressRail}>
            <div className={styles.railItem}>
              <div className={styles.railDot}></div>
              <span>Setup</span>
            </div>
            <div className={styles.railLine}></div>
            <div className={styles.railItem}>
              <div className={styles.railDot}></div>
              <span>Planning</span>
            </div>
            <div className={styles.railLine}></div>
            <div className={styles.railItem}>
              <div className={styles.railDot}></div>
              <span>Analytics</span>
            </div>
            <div className={styles.railLine}></div>
            <div className={styles.railItem}>
              <div className={styles.railDot}></div>
              <span>Predictions</span>
            </div>
          </nav>

          <section id="setup">
            <h2 className={styles.sectionTitle}>Setup</h2>
            <SkillsSection key={`skills-${refreshKey}`} onUpdate={handleRefresh} />
            <TeamsSection key={`teams-${refreshKey}`} onUpdate={handleRefresh} />
            <DevelopersSection key={`devs-${refreshKey}`} onUpdate={handleRefresh} />
          </section>

          <section id="planning">
            <h2 className={styles.sectionTitle}>Planning</h2>
            <SprintsSection key={`sprints-${refreshKey}`} onUpdate={handleRefresh} />
            <TasksSection key={`tasks-${refreshKey}`} onUpdate={handleRefresh} />
            <AssignmentsSection key={`assignments-${refreshKey}`} onUpdate={handleRefresh} />
          </section>

          <section id="analytics">
            <h2 className={styles.sectionTitle}>Analytics</h2>
            <AnalyticsSection key={`analytics-${refreshKey}`} />
          </section>

          <section id="predictions">
            <h2 className={styles.sectionTitle}>Predictions</h2>
            <PredictionsSection key={`predictions-${refreshKey}`} onUpdate={handleRefresh} />
          </section>
        </main>
      </div>
    </div>
  );
}
