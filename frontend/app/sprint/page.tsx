"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadWorkspace } from "@/lib/storage";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";
import styles from "./sprint.module.css";

export default function SprintPlanningPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const workspace = mounted ? loadWorkspace() : null;
  const activeSprint = workspace?.sprints.find((s) => s.status === "ACTIVE") || workspace?.sprints[0];
  const sprintTasks = activeSprint && workspace
    ? workspace.tasks.filter((t) => t.sprintId === activeSprint.id)
    : [];

  const todoTasks = sprintTasks.filter((t) => t.status === "PLANNED");
  const inProgressTasks = sprintTasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = sprintTasks.filter((t) => t.status === "DONE");
  const blockedTasks = sprintTasks.filter((t) => t.status === "BLOCKED");

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  if (!mounted || !workspace) {
    return null;
  }

  if (!activeSprint) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h2>No Active Sprint</h2>
          <p>Create a sprint to start planning tasks</p>
          <button className={styles.primaryButton} onClick={() => router.push("/")}>
            Go to Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {activeSprint.name} ({activeSprint.startDate} - {activeSprint.endDate})
          </h1>
          <p className={styles.subtitle}>
            Status: <span className={styles.statusBadge}>{activeSprint.status}</span>
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryButton} onClick={() => router.push("/analytics")}>
            Run Prediction
          </button>
          <button className={styles.primaryButton} onClick={() => setShowCreateModal(true)}>
            + New Task
          </button>
        </div>
      </div>

      <div className={styles.kanbanBoard}>
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <h3 className={styles.columnTitle}>TODO</h3>
            <span className={styles.columnCount}>{todoTasks.length}</span>
          </div>
          <div className={styles.columnContent}>
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={handleRefresh} />
            ))}
            {todoTasks.length === 0 && (
              <div className={styles.emptyColumn}>No tasks</div>
            )}
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <h3 className={styles.columnTitle}>IN PROGRESS</h3>
            <span className={styles.columnCount}>{inProgressTasks.length}</span>
          </div>
          <div className={styles.columnContent}>
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={handleRefresh} />
            ))}
            {inProgressTasks.length === 0 && (
              <div className={styles.emptyColumn}>No tasks</div>
            )}
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <h3 className={styles.columnTitle}>BLOCKED</h3>
            <span className={styles.columnCount}>{blockedTasks.length}</span>
          </div>
          <div className={styles.columnContent}>
            {blockedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={handleRefresh} />
            ))}
            {blockedTasks.length === 0 && (
              <div className={styles.emptyColumn}>No tasks</div>
            )}
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <h3 className={styles.columnTitle}>DONE</h3>
            <span className={styles.columnCount}>{doneTasks.length}</span>
          </div>
          <div className={styles.columnContent}>
            {doneTasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={handleRefresh} />
            ))}
            {doneTasks.length === 0 && (
              <div className={styles.emptyColumn}>No tasks</div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          sprintId={activeSprint.id}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            handleRefresh();
          }}
        />
      )}
    </div>
  );
}
