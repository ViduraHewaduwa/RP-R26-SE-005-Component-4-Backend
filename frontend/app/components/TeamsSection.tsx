"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";
import Field from "@/components/Field";
import Button from "@/components/Button";
import StatusBanner from "@/components/StatusBanner";
import DataTable from "@/components/DataTable";
import { createTeam } from "@/lib/api";
import { addTeam, getTeams } from "@/lib/storage";
import type { TeamResponse } from "@/lib/types";

interface TeamsSectionProps {
  onUpdate: () => void;
}

export default function TeamsSection({ onUpdate }: TeamsSectionProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details: string[] } | null>(null);
  const [success, setSuccess] = useState(false);

  const teams = getTeams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createTeam({
        code,
        name,
        description: description || undefined,
        developerIds: [],
      });
      addTeam(result);
      setCode("");
      setName("");
      setDescription("");
      setSuccess(true);
      onUpdate();
    } catch (err: any) {
      setError({
        message: err.error || "Failed to create team",
        details: err.details || [],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setCode("ALPHA");
    setName("Alpha Squad");
    setDescription("Pilot sprint-cost team");
  };

  return (
    <SectionCard
      title="Teams"
      subtitle="Create teams for sprint planning"
      collapsible
      defaultExpanded={teams.length === 0}
    >
      <form onSubmit={handleSubmit}>
        {error && <StatusBanner type="error" message={error.message} details={error.details} />}
        {success && <StatusBanner type="success" message="Team created successfully" />}

        <Field
          type="input"
          label="Team Code"
          required
          inputProps={{
            value: code,
            onChange: (e) => setCode(e.target.value.toUpperCase()),
            placeholder: "e.g., ALPHA",
          }}
        />

        <Field
          type="input"
          label="Team Name"
          required
          inputProps={{
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "e.g., Alpha Squad",
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

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button type="submit" loading={loading}>
            Create Team
          </Button>
          <Button type="button" variant="secondary" onClick={loadSample}>
            Load Sample
          </Button>
        </div>
      </form>

      {teams.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h4 style={{ marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>
            Created Teams
          </h4>
          <DataTable
            columns={[
              { header: "ID", accessor: (t: TeamResponse) => t.id, width: "60px" },
              { header: "Code", accessor: (t: TeamResponse) => t.code, width: "100px" },
              { header: "Name", accessor: (t: TeamResponse) => t.name },
              { header: "Description", accessor: (t: TeamResponse) => t.description || "—" },
            ]}
            data={teams}
          />
        </div>
      )}
    </SectionCard>
  );
}
