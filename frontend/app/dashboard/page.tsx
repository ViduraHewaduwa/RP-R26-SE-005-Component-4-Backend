"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadWorkspace } from "@/lib/storage";
import { formatCurrency } from "@/lib/utils";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const workspace = mounted ? loadWorkspace() : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !workspace) {
    return null;
  }

  const activeSprint = workspace.sprints.find((s) => s.status === "ACTIVE") || workspace.sprints[0];
  const sprintTasks = activeSprint ? workspace.tasks.filter((t) => t.sprintId === activeSprint.id) : [];
  const doneTasks = sprintTasks.filter((t) => t.status === "DONE");
  const inProgressTasks = sprintTasks.filter((t) => t.status === "IN_PROGRESS");
  const todoTasks = sprintTasks.filter((t) => t.status === "PLANNED");

  const totalStoryPoints = sprintTasks.reduce((sum, t) => sum + t.storyPoints, 0);
  const completedStoryPoints = sprintTasks.reduce((sum, t) => sum + (t.completedStoryPoints || 0), 0);
  const progressPercent = totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0;

  const latestPrediction = activeSprint
    ? workspace.predictions
        .filter((p) => p.sprintId === activeSprint.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  const teamSize = workspace.developers.length;

  const calculateDaysRemaining = () => {
    if (!activeSprint) return 0;
    const today = new Date();
    const endDate = new Date(activeSprint.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {activeSprint ? `Active Sprint: ${activeSprint.name}` : "No Active Sprint"}
          </h1>
          {activeSprint && (
            <p className={styles.subtitle}>
              {activeSprint.teamCode} • {activeSprint.startDate} to {activeSprint.endDate}
            </p>
          )}
        </div>
        <button className={styles.createButton} onClick={() => router.push("/sprint")}>
          {activeSprint ? "View Sprint" : "Create Sprint"}
        </button>
      </div>

      {!activeSprint && (
        <div className={styles.emptyState}>
          <h2>Welcome to AI Driven Human Aware Sprint Cost Forecasting</h2>
          <p>Get started by creating your first sprint</p>
          <button className={styles.primaryButton} onClick={() => router.push("/sprint")}>
            Create Your First Sprint
          </button>
        </div>
      )}

      {activeSprint && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Team Size</div>
              <div className={styles.statValue}>{teamSize}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Story Points</div>
              <div className={styles.statValue}>
                {completedStoryPoints.toFixed(1)} / {totalStoryPoints.toFixed(1)}
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Predicted Cost</div>
              <div className={styles.statValue}>
                {latestPrediction ? formatCurrency(latestPrediction.predictedCost) : "—"}
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Sprint Progress</h3>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className={styles.progressText}>
              {progressPercent.toFixed(0)}% complete • {daysRemaining} days remaining
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Tasks by Status</h3>
            <div className={styles.taskStats}>
              <div className={styles.taskStatItem}>
                <span className={styles.taskStatIcon}>✓</span>
                <span className={styles.taskStatLabel}>Done</span>
                <span className={styles.taskStatCount}>{doneTasks.length}</span>
              </div>
              <div className={styles.taskStatItem}>
                <span className={styles.taskStatIcon}>⚡</span>
                <span className={styles.taskStatLabel}>In Progress</span>
                <span className={styles.taskStatCount}>{inProgressTasks.length}</span>
              </div>
              <div className={styles.taskStatItem}>
                <span className={styles.taskStatIcon}>○</span>
                <span className={styles.taskStatLabel}>Todo</span>
                <span className={styles.taskStatCount}>{todoTasks.length}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Team Availability</h3>
            <div className={styles.teamList}>
              {workspace.developers.slice(0, 5).map((dev) => {
                const availability = dev.allocationPercent / 100;
                return (
                  <div key={dev.id} className={styles.teamMember}>
                    <span className={styles.memberIcon}>👤</span>
                    <span className={styles.memberName}>{dev.name}</span>
                    <div className={styles.availabilityBar}>
                      <div
                        className={styles.availabilityFill}
                        style={{ width: `${availability * 100}%` }}
                      ></div>
                    </div>
                    <span className={styles.availabilityText}>{(availability * 100).toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryButton} onClick={() => router.push("/sprint")}>
              View Full Sprint
            </button>
            <button className={styles.secondaryButton} onClick={() => router.push("/analytics")}>
              Run Cost Prediction
            </button>
          </div>
        </>
      )}
    </div>
  );
}
