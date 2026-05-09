"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";
import Field from "@/components/Field";
import Button from "@/components/Button";
import StatusBanner from "@/components/StatusBanner";
import DataTable from "@/components/DataTable";
import { createTask } from "@/lib/api";
import { addTask, getTasks, getSprints, getSkills } from "@/lib/storage";
import type { TaskResponse } from "@/lib/types";

interface TasksSectionProps {
  onUpdate: () => void;
}

export default function TasksSection({ onUpdate }: TasksSectionProps) {
  const [sprintId, setSprintId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [storyPoints, setStoryPoints] = useState("8");
  const [completedStoryPoints, setCompletedStoryPoints] = useState("3");
  const [actualEffortMinutes, setActualEffortMinutes] = useState("300");
  const [status, setStatus] = useState<"PLANNED" | "IN_PROGRESS" | "DONE" | "BLOCKED">("IN_PROGRESS");
  const [requiredSkillIds, setRequiredSkillIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details: string[] } | null>(null);
  const [success, setSuccess] = useState(false);

  const tasks = getTasks();
  const sprints = getSprints();
  const skills = getSkills();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createTask({
        sprintId: parseInt(sprintId),
        title,
        description: description || undefined,
        storyPoints: parseFloat(storyPoints),
        completedStoryPoints: completedStoryPoints ? parseFloat(completedStoryPoints) : undefined,
        actualEffortMinutes: actualEffortMinutes ? parseInt(actualEffortMinutes) : undefined,
        status,
        requiredSkillIds: requiredSkillIds.length > 0 ? requiredSkillIds : undefined,
      });
      addTask(result);
      setTitle("");
      setDescription("");
      setStoryPoints("8");
      setCompletedStoryPoints("");
      setActualEffortMinutes("");
      setRequiredSkillIds([]);
      setSuccess(true);
      onUpdate();
    } catch (err: any) {
      setError({
        message: err.error || "Failed to create task",
        details: err.details || [],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    if (sprints.length === 0) {
      alert("Please create a sprint first");
      return;
    }
    setSprintId(sprints[0].id.toString());
    setTitle("Build sprint forecasting API");
    setDescription("Implement the API and validation layer for sprint cost predictions");
    setStoryPoints("8");
    setCompletedStoryPoints("3");
    setActualEffortMinutes("300");
    setStatus("IN_PROGRESS");
    if (skills.length > 0) {
      setRequiredSkillIds([skills[0].id]);
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
    <SectionCard
      title="Tasks"
      subtitle="Create tasks for sprints"
      collapsible
      defaultExpanded={tasks.length === 0}
    >
      <form onSubmit={handleSubmit}>
        {error && <StatusBanner type="error" message={error.message} details={error.details} />}
        {success && <StatusBanner type="success" message="Task created successfully" />}

        <Field
          type="select"
          label="Sprint"
          required
          selectProps={{
            value: sprintId,
            onChange: (e) => setSprintId(e.target.value),
          }}
        >
          <option value="">Select a sprint</option>
          {sprints.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.teamCode})
            </option>
          ))}
        </Field>

        <Field
          type="input"
          label="Task Title"
          required
          inputProps={{
            value: title,
            onChange: (e) => setTitle(e.target.value),
            placeholder: "e.g., Build sprint forecasting API",
          }}
        />

        <Field
          type="textarea"
          label="Description"
          textareaProps={{
            value: description,
            onChange: (e) => setDescription(e.target.value),
            placeholder: "Optional description",
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
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
            type="input"
            label="Completed Points"
            inputProps={{
              type: "number",
              step: "0.5",
              value: completedStoryPoints,
              onChange: (e) => setCompletedStoryPoints(e.target.value),
              placeholder: "Optional",
            }}
          />

          <Field
            type="input"
            label="Effort (minutes)"
            inputProps={{
              type: "number",
              value: actualEffortMinutes,
              onChange: (e) => setActualEffortMinutes(e.target.value),
              placeholder: "Optional",
            }}
          />
        </div>

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

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <Button type="submit" loading={loading} disabled={!sprintId}>
            Create Task
          </Button>
          <Button type="button" variant="secondary" onClick={loadSample}>
            Load Sample
          </Button>
        </div>
      </form>

      {tasks.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h4 style={{ marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>
            Created Tasks
          </h4>
          <DataTable
            columns={[
              { header: "ID", accessor: (t: TaskResponse) => t.id, width: "60px" },
              { header: "Title", accessor: (t: TaskResponse) => t.title },
              { header: "Points", accessor: (t: TaskResponse) => t.storyPoints, width: "80px" },
              { header: "Status", accessor: (t: TaskResponse) => t.status, width: "120px" },
              { header: "Skills", accessor: (t: TaskResponse) => t.requiredSkills.join(", ") || "—" },
            ]}
            data={tasks}
          />
        </div>
      )}
    </SectionCard>
  );
}
