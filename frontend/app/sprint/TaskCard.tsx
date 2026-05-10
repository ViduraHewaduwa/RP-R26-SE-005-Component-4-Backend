"use client";

import type { TaskResponse } from "@/lib/types";
import styles from "./TaskCard.module.css";

interface TaskCardProps {
  task: TaskResponse;
  onUpdate: () => void;
}

export default function TaskCard({ task }: TaskCardProps) {
  const progressPercent = task.storyPoints > 0
    ? ((task.completedStoryPoints || 0) / task.storyPoints) * 100
    : 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.taskId}>#{task.id}</span>
        <span className={styles.storyPoints}>{task.storyPoints} SP</span>
      </div>

      <h4 className={styles.title}>{task.title}</h4>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      {task.completedStoryPoints !== null && task.completedStoryPoints > 0 && (
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className={styles.progressText}>
            {task.completedStoryPoints} / {task.storyPoints} SP
          </span>
        </div>
      )}

      {task.requiredSkills.length > 0 && (
        <div className={styles.skills}>
          {task.requiredSkills.map((skill, idx) => (
            <span key={idx} className={styles.skillTag}>
              {skill}
            </span>
          ))}
        </div>
      )}

      {task.actualEffortMinutes && (
        <div className={styles.effort}>
          ⏱ {(task.actualEffortMinutes / 60).toFixed(1)}h logged
        </div>
      )}
    </div>
  );
}
