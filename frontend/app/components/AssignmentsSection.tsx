"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";
import Field from "@/components/Field";
import Button from "@/components/Button";
import StatusBanner from "@/components/StatusBanner";
import DataTable from "@/components/DataTable";
import { createAssignment } from "@/lib/api";
import { addAssignment, getAssignments, getTasks, getDevelopers } from "@/lib/storage";
import type { AssignmentResponse } from "@/lib/types";

interface AssignmentsSectionProps {
  onUpdate: () => void;
}

export default function AssignmentsSection({ onUpdate }: AssignmentsSectionProps) {
  const [taskId, setTaskId] = useState("");
  const [developerId, setDeveloperId] = useState("");
  const [allocatedHours, setAllocatedHours] = useState("16");
  const [overtimeHours, setOvertimeHours] = useState("1.5");
  const [actualEffortMinutes, setActualEffortMinutes] = useState("240");
  const [status, setStatus] = useState<"PLANNED" | "ACTIVE" | "COMPLETED">("ACTIVE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details: string[] } | null>(null);
  const [success, setSuccess] = useState(false);

  const assignments = getAssignments();
  const tasks = getTasks();
  const developers = getDevelopers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createAssignment({
        taskId: parseInt(taskId),
        developerId: parseInt(developerId),
        allocatedHours: parseFloat(allocatedHours),
        overtimeHours: overtimeHours ? parseFloat(overtimeHours) : undefined,
        actualEffortMinutes: actualEffortMinutes ? parseInt(actualEffortMinutes) : undefined,
        status,
      });
      addAssignment(result);
      setAllocatedHours("16");
      setOvertimeHours("");
      setActualEffortMinutes("");
      setSuccess(true);
      onUpdate();
    } catch (err: any) {
      setError({
        message: err.error || "Failed to create assignment",
        details: err.details || [],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    if (tasks.length === 0 || developers.length === 0) {
      alert("Please create tasks and developers first");
      return;
    }
    setTaskId(tasks[0].id.toString());
    setDeveloperId(developers[0].id.toString());
    setAllocatedHours("16");
    setOvertimeHours("1.5");
    setActualEffortMinutes("240");
    setStatus("ACTIVE");
  };

  return (
    <SectionCard
      title="Assignments"
      subtitle="Assign developers to tasks"
      collapsible
      defaultExpanded={assignments.length === 0}
    >
      <form onSubmit={handleSubmit}>
        {error && <StatusBanner type="error" message={error.message} details={error.details} />}
        {success && <StatusBanner type="success" message="Assignment created successfully" />}

        <Field
          type="select"
          label="Task"
          required
          selectProps={{
            value: taskId,
            onChange: (e) => setTaskId(e.target.value),
          }}
        >
          <option value="">Select a task</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              #{t.id} - {t.title}
            </option>
          ))}
        </Field>

        <Field
          type="select"
          label="Developer"
          required
          selectProps={{
            value: developerId,
            onChange: (e) => setDeveloperId(e.target.value),
          }}
        >
          <option value="">Select a developer</option>
          {developers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.role})
            </option>
          ))}
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <Field
            type="input"
            label="Allocated Hours"
            required
            inputProps={{
              type: "number",
              step: "0.5",
              value: allocatedHours,
              onChange: (e) => setAllocatedHours(e.target.value),
            }}
          />

          <Field
            type="input"
            label="Overtime Hours"
            inputProps={{
              type: "number",
              step: "0.5",
              value: overtimeHours,
              onChange: (e) => setOvertimeHours(e.target.value),
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
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
        </Field>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button type="submit" loading={loading} disabled={!taskId || !developerId}>
            Create Assignment
          </Button>
          <Button type="button" variant="secondary" onClick={loadSample}>
            Load Sample
          </Button>
        </div>
      </form>

      {assignments.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h4 style={{ marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>
            Created Assignments
          </h4>
          <DataTable
            columns={[
              { header: "ID", accessor: (a: AssignmentResponse) => a.id, width: "60px" },
              { header: "Task", accessor: (a: AssignmentResponse) => `#${a.taskId}`, width: "80px" },
              { header: "Developer", accessor: (a: AssignmentResponse) => a.developerName },
              { header: "Hours", accessor: (a: AssignmentResponse) => a.allocatedHours, width: "80px" },
              { header: "Overtime", accessor: (a: AssignmentResponse) => a.overtimeHours ?? "—", width: "100px" },
              { header: "Status", accessor: (a: AssignmentResponse) => a.status, width: "100px" },
            ]}
            data={assignments}
          />
        </div>
      )}
    </SectionCard>
  );
}
