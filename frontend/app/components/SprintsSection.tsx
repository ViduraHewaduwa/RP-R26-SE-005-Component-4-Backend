"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";
import Field from "@/components/Field";
import Button from "@/components/Button";
import StatusBanner from "@/components/StatusBanner";
import DataTable from "@/components/DataTable";
import { createSprint } from "@/lib/api";
import { addSprint, getSprints, getTeams } from "@/lib/storage";
import { formatDate, getTodayISO, addDays, isEndAfterStart } from "@/lib/utils";
import type { SprintResponse } from "@/lib/types";

interface SprintsSectionProps {
  onUpdate: () => void;
}

export default function SprintsSection({ onUpdate }: SprintsSectionProps) {
  const [teamId, setTeamId] = useState("");
  const [name, setName] = useState("");
  const [sprintNumber, setSprintNumber] = useState("12");
  const [startDate, setStartDate] = useState(getTodayISO());
  const [endDate, setEndDate] = useState(addDays(getTodayISO(), 11));
  const [status, setStatus] = useState<"PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED">("ACTIVE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details: string[] } | null>(null);
  const [success, setSuccess] = useState(false);

  const sprints = getSprints();
  const teams = getTeams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEndAfterStart(startDate, endDate)) {
      setError({
        message: "Validation Error",
        details: ["End date must be on or after start date"],
      });
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createSprint({
        teamId: parseInt(teamId),
        name,
        sprintNumber: parseInt(sprintNumber),
        startDate,
        endDate,
        status,
      });
      addSprint(result);
      setName("");
      setSprintNumber((prev) => (parseInt(prev) + 1).toString());
      setSuccess(true);
      onUpdate();
    } catch (err: any) {
      setError({
        message: err.error || "Failed to create sprint",
        details: err.details || [],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    if (teams.length === 0) {
      alert("Please create a team first");
      return;
    }
    setTeamId(teams[0].id.toString());
    setName("Sprint 12");
    setSprintNumber("12");
    setStartDate("2026-05-04");
    setEndDate("2026-05-15");
    setStatus("ACTIVE");
  };

  return (
    <SectionCard
      title="Sprints"
      subtitle="Create sprints for your team"
      collapsible
      defaultExpanded={sprints.length === 0}
    >
      <form onSubmit={handleSubmit}>
        {error && <StatusBanner type="error" message={error.message} details={error.details} />}
        {success && <StatusBanner type="success" message="Sprint created successfully" />}

        <Field
          type="select"
          label="Team"
          required
          selectProps={{
            value: teamId,
            onChange: (e) => setTeamId(e.target.value),
          }}
        >
          <option value="">Select a team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.code} - {t.name}
            </option>
          ))}
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
          <Field
            type="input"
            label="Sprint Name"
            required
            inputProps={{
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "e.g., Sprint 12",
            }}
          />

          <Field
            type="input"
            label="Sprint Number"
            required
            inputProps={{
              type: "number",
              value: sprintNumber,
              onChange: (e) => setSprintNumber(e.target.value),
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field
            type="input"
            label="Start Date"
            required
            inputProps={{
              type: "date",
              value: startDate,
              onChange: (e) => setStartDate(e.target.value),
            }}
          />

          <Field
            type="input"
            label="End Date"
            required
            inputProps={{
              type: "date",
              value: endDate,
              onChange: (e) => setEndDate(e.target.value),
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
          <option value="CANCELLED">Cancelled</option>
        </Field>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button type="submit" loading={loading} disabled={!teamId}>
            Create Sprint
          </Button>
          <Button type="button" variant="secondary" onClick={loadSample}>
            Load Sample
          </Button>
        </div>
      </form>

      {sprints.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h4 style={{ marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>
            Created Sprints
          </h4>
          <DataTable
            columns={[
              { header: "ID", accessor: (s: SprintResponse) => s.id, width: "60px" },
              { header: "Name", accessor: (s: SprintResponse) => s.name },
              { header: "Team", accessor: (s: SprintResponse) => s.teamCode, width: "100px" },
              { header: "Start", accessor: (s: SprintResponse) => formatDate(s.startDate), width: "120px" },
              { header: "End", accessor: (s: SprintResponse) => formatDate(s.endDate), width: "120px" },
              { header: "Status", accessor: (s: SprintResponse) => s.status, width: "100px" },
            ]}
            data={sprints}
          />
        </div>
      )}
    </SectionCard>
  );
}
