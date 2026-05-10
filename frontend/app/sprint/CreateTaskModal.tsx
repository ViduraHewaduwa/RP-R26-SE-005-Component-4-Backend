"use client";

import { useState } from "react";
import { createTask } from "@/lib/api";
import { addTask, getSkills } from "@/lib/storage";
import Field from "@/components/Field";
import Button from "@/components/Button";
import StatusBanner from "@/components/StatusBanner";
import styles from "./CreateTaskModal.module.css";

interface CreateTaskModalProps {
  sprintId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTaskModal({ sprintId, onClose, onSuccess }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [storyPoints, setStoryPoints] = useState("5");
  const [status, setStatus] = useState<"PLANNED" | "IN_PROGRESS" | "DONE" | "BLOCKED">("PLANNED");
  const [requiredSkillIds, setRequiredSkillIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details: string[] } | null>(null);

  const skills = getSkills();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createTask({
        sprintId,
        title,
        description: description || undefined,
        storyPoints: parseFloat(storyPoints),
        status,
        requiredSkillIds: requiredSkillIds.length > 0 ? requiredSkillIds : undefined,
      });
      addTask(result);
      onSuccess();
    } catch (err: any) {
      setError({
        message: err.error || err.message || "Failed to create task",
        details: err.details || [],
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skillId: number) => {
    if (requiredSkillIds.includes(skillId)) {
      setRequiredSkillIds(requiredSkillIds.filter((id) => id !== skillId));
    } else {
      setRequiredSkillIds([...requiredSkillIds, skillId]);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create New Task</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <StatusBanner type="error" message={error.message} details={error.details} />}

          <Field
            type="input"
            label="Task Title"
            required
            inputProps={{
              value: title,
              onChange: (e) => setTitle(e.target.value),
              placeholder: "e.g., Implement user authentication",
              autoFocus: true,
            }}
          />

          <Field
            type="textarea"
            label="Description"
            textareaProps={{
              value: description,
              onChange: (e) => setDescription(e.target.value),
              placeholder: "Optional description",
              rows: 3,
            }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field
              type="input"
              label="Story Points"
              required
              inputProps={{
                type: "number",
                step: "0.5",
                value: storyPoints,
                onChange: (e) => setStoryPoints(e.target.value),
              }}
            />

            <Field
              type="select"
              label="Status"
              required
              selectProps={{
                value: status,
                onChange: (e) => setStatus(e.target.value as any),
              }}
            >
              <option value="PLANNED">Planned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
              <option value="BLOCKED">Blocked</option>
            </Field>
          </div>

          {skills.length > 0 && (
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                Required Skills
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {skills.map((skill) => (
                  <label
                    key={skill.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.375rem 0.75rem",
                      background: requiredSkillIds.includes(skill.id) ? "#dbeafe" : "#f3f4f6",
                      border: `1px solid ${requiredSkillIds.includes(skill.id) ? "#3b82f6" : "#d1d5db"}`,
                      borderRadius: "4px",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={requiredSkillIds.includes(skill.id)}
                      onChange={() => toggleSkill(skill.id)}
                    />
                    {skill.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
