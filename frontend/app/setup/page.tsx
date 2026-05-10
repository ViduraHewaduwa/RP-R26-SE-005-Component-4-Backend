"use client";

import { useState, useEffect } from "react";
import WorkspaceSummary from "../components/WorkspaceSummary";
import SkillsSection from "../components/SkillsSection";
import TeamsSection from "../components/TeamsSection";
import DevelopersSection from "../components/DevelopersSection";
import SprintsSection from "../components/SprintsSection";
import TasksSection from "../components/TasksSection";
import AssignmentsSection from "../components/AssignmentsSection";
import styles from "./setup.module.css";

export default function SetupPage() {
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <WorkspaceSummary key={refreshKey} />
        </aside>

        <main className={styles.main}>
          <h1 className={styles.title}>Setup & Configuration</h1>
          <p className={styles.subtitle}>
            Create and manage your team, skills, sprints, and tasks
          </p>

          <section id="setup">
            <h2 className={styles.sectionTitle}>Team Setup</h2>
            <SkillsSection key={`skills-${refreshKey}`} onUpdate={handleRefresh} />
            <TeamsSection key={`teams-${refreshKey}`} onUpdate={handleRefresh} />
            <DevelopersSection key={`devs-${refreshKey}`} onUpdate={handleRefresh} />
          </section>

          <section id="planning">
            <h2 className={styles.sectionTitle}>Sprint Planning</h2>
            <SprintsSection key={`sprints-${refreshKey}`} onUpdate={handleRefresh} />
            <TasksSection key={`tasks-${refreshKey}`} onUpdate={handleRefresh} />
            <AssignmentsSection key={`assignments-${refreshKey}`} onUpdate={handleRefresh} />
          </section>
        </main>
      </div>
    </div>
  );
}
