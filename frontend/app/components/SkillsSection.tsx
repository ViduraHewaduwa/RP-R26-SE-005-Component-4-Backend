"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";
import Field from "@/components/Field";
import Button from "@/components/Button";
import StatusBanner from "@/components/StatusBanner";
import DataTable from "@/components/DataTable";
import { createSkill } from "@/lib/api";
import { addSkill, getSkills } from "@/lib/storage";
import type { SkillResponse } from "@/lib/types";

interface SkillsSectionProps {
  onUpdate: () => void;
}

export default function SkillsSection({ onUpdate }: SkillsSectionProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details: string[] } | null>(null);
  const [success, setSuccess] = useState(false);

  const skills = getSkills();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createSkill({ name, description: description || undefined });
      addSkill(result);
      setName("");
      setDescription("");
      setSuccess(true);
      onUpdate();
    } catch (err: any) {
      setError({
        message: err.error || "Failed to create skill",
        details: err.details || [],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setName("Spring Boot");
    setDescription("Backend API development");
  };

  return (
    <SectionCard
      title="Skills"
      subtitle="Create skills that developers can possess"
      collapsible
      defaultExpanded={skills.length === 0}
    >
      <form onSubmit={handleSubmit}>
        {error && <StatusBanner type="error" message={error.message} details={error.details} />}
        {success && <StatusBanner type="success" message="Skill created successfully" />}

        <Field
          type="input"
          label="Skill Name"
          required
          inputProps={{
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "e.g., Spring Boot",
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
            Create Skill
          </Button>
          <Button type="button" variant="secondary" onClick={loadSample}>
            Load Sample
          </Button>
        </div>
      </form>

      {skills.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h4 style={{ marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>
            Created Skills
          </h4>
          <DataTable
            columns={[
              { header: "ID", accessor: (s: SkillResponse) => s.id, width: "60px" },
              { header: "Name", accessor: (s: SkillResponse) => s.name },
              { header: "Description", accessor: (s: SkillResponse) => s.description || "—" },
            ]}
            data={skills}
          />
        </div>
      )}
    </SectionCard>
  );
}
