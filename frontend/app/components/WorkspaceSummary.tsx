"use client";

import { loadWorkspace } from "@/lib/storage";
import styles from "./WorkspaceSummary.module.css";

export default function WorkspaceSummary() {
  const workspace = loadWorkspace();

  return (
    <div className={styles.summary}>
      <h3 className={styles.title}>Local Workspace</h3>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Skills</span>
          <span className={styles.value}>{workspace.skills.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Teams</span>
          <span className={styles.value}>{workspace.teams.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Developers</span>
          <span className={styles.value}>{workspace.developers.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Sprints</span>
          <span className={styles.value}>{workspace.sprints.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Tasks</span>
          <span className={styles.value}>{workspace.tasks.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Assignments</span>
          <span className={styles.value}>{workspace.assignments.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Predictions</span>
          <span className={styles.value}>{workspace.predictions.length}</span>
        </div>
      </div>

      {workspace.teams.length > 0 && (
        <div className={styles.detail}>
          <h4 className={styles.detailTitle}>Active Team</h4>
          <p className={styles.detailText}>
            {workspace.teams[0].code} - {workspace.teams[0].name}
          </p>
        </div>
      )}

      {workspace.sprints.length > 0 && (
        <div className={styles.detail}>
          <h4 className={styles.detailTitle}>Recent Sprint</h4>
          <p className={styles.detailText}>
            {workspace.sprints[workspace.sprints.length - 1].name}
          </p>
        </div>
      )}
    </div>
  );
}
