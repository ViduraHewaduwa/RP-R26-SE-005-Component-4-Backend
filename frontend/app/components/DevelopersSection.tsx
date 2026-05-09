"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";
import Field from "@/components/Field";
import Button from "@/components/Button";
import StatusBanner from "@/components/StatusBanner";
import DataTable from "@/components/DataTable";
import { createDeveloper } from "@/lib/api";
import { addDeveloper, getDevelopers, getSkills, getTeams } from "@/lib/storage";
import type { DeveloperResponse, DeveloperSkillRequest, CalendarEntryRequest } from "@/lib/types";
import styles from "./DevelopersSection.module.css";

interface DevelopersSectionProps {
  onUpdate: () => void;
}

export default function DevelopersSection({ onUpdate }: DevelopersSectionProps) {
  const [name, setName] = useState("");
  const [seniority, setSeniority] = useState<"JUNIOR" | "MID" | "SENIOR" | "LEAD">("SENIOR");
  const [hourlyRate, setHourlyRate] = useState("45");
  const [allocationPercent, setAllocationPercent] = useState("100");
  const [role, setRole] = useState<"BACKEND" | "FRONTEND" | "FULL_STACK" | "QA" | "DEVOPS" | "ARCHITECT">("BACKEND");
  const [teamId, setTeamId] = useState("");
  const [skills, setSkills] = useState<DeveloperSkillRequest[]>([]);
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntryRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details: string[] } | null>(null);
  const [success, setSuccess] = useState(false);

  const developers = getDevelopers();
  const availableSkills = getSkills();
  const teams = getTeams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await createDeveloper({
        name,
        seniority,
        hourlyRate: parseFloat(hourlyRate),
        allocationPercent: parseFloat(allocationPercent),
        role,
        teamId: teamId ? parseInt(teamId) : undefined,
        skills: skills.length > 0 ? skills : undefined,
        calendarEntries: calendarEntries.length > 0 ? calendarEntries : undefined,
      });
      addDeveloper(result);
      setName("");
      setHourlyRate("45");
      setAllocationPercent("100");
      setTeamId("");
      setSkills([]);
      setCalendarEntries([]);
      setSuccess(true);
      onUpdate();
    } catch (err: any) {
      setError({
        message: err.error || "Failed to create developer",
        details: err.details || [],
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkillRow = () => {
    if (availableSkills.length === 0) {
      alert("Please create skills first");
      return;
    }
    setSkills([...skills, { skillId: availableSkills[0].id, proficiencyLevel: 3 }]);
  };

  const removeSkillRow = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkillRow = (index: number, field: keyof DeveloperSkillRequest, value: any) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  };

  const addCalendarRow = () => {
    setCalendarEntries([
      ...calendarEntries,
      { entryDate: "2026-05-10", entryType: "LEAVE" },
    ]);
  };

  const removeCalendarRow = (index: number) => {
    setCalendarEntries(calendarEntries.filter((_, i) => i !== index));
  };

  const updateCalendarRow = (index: number, field: keyof CalendarEntryRequest, value: any) => {
    const updated = [...calendarEntries];
    updated[index] = { ...updated[index], [field]: value };
    setCalendarEntries(updated);
  };

  const loadSample = () => {
    setName("Nimal Perera");
    setSeniority("SENIOR");
    setRole("BACKEND");
    setHourlyRate("45");
    setAllocationPercent("100");
    if (teams.length > 0) {
      setTeamId(teams[0].id.toString());
    }
  };

  return (
    <SectionCard
      title="Developers"
      subtitle="Create developers with skills and calendar entries"
      collapsible
      defaultExpanded={developers.length === 0}
    >
      <form onSubmit={handleSubmit}>
        {error && <StatusBanner type="error" message={error.message} details={error.details} />}
        {success && <StatusBanner type="success" message="Developer created successfully" />}

        <Field
          type="input"
          label="Developer Name"
          required
          inputProps={{
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "e.g., Nimal Perera",
          }}
        />

        <div className={styles.row}>
          <Field
            type="select"
            label="Seniority"
            required
            selectProps={{
              value: seniority,
              onChange: (e) => setSeniority(e.target.value as any),
            }}
          >
            <option value="JUNIOR">Junior</option>
            <option value="MID">Mid</option>
            <option value="SENIOR">Senior</option>
            <option value="LEAD">Lead</option>
          </Field>

          <Field
            type="select"
            label="Role"
            required
            selectProps={{
              value: role,
              onChange: (e) => setRole(e.target.value as any),
            }}
          >
            <option value="BACKEND">Backend</option>
            <option value="FRONTEND">Frontend</option>
            <option value="FULL_STACK">Full Stack</option>
            <option value="QA">QA</option>
            <option value="DEVOPS">DevOps</option>
            <option value="ARCHITECT">Architect</option>
          </Field>
        </div>

        <div className={styles.row}>
          <Field
            type="input"
            label="Hourly Rate ($)"
            required
            inputProps={{
              type: "number",
              step: "0.01",
              value: hourlyRate,
              onChange: (e) => setHourlyRate(e.target.value),
            }}
          />

          <Field
            type="input"
            label="Allocation (%)"
            required
            inputProps={{
              type: "number",
              step: "1",
              min: "0",
              max: "100",
              value: allocationPercent,
              onChange: (e) => setAllocationPercent(e.target.value),
            }}
          />
        </div>

        <Field
          type="select"
          label="Team"
          selectProps={{
            value: teamId,
            onChange: (e) => setTeamId(e.target.value),
          }}
        >
          <option value="">No team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.code} - {t.name}
            </option>
          ))}
        </Field>

        <div className={styles.nested}>
          <div className={styles.nestedHeader}>
            <h4>Skills</h4>
            <Button type="button" size="sm" variant="secondary" onClick={addSkillRow}>
              + Add Skill
            </Button>
          </div>
          {skills.map((skill, idx) => (
            <div key={idx} className={styles.nestedRow}>
              <select
                value={skill.skillId}
                onChange={(e) => updateSkillRow(idx, "skillId", parseInt(e.target.value))}
                className={styles.nestedSelect}
              >
                {availableSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <select
                value={skill.proficiencyLevel}
                onChange={(e) => updateSkillRow(idx, "proficiencyLevel", parseInt(e.target.value))}
                className={styles.nestedSelect}
              >
                <option value={1}>Level 1</option>
                <option value={2}>Level 2</option>
                <option value={3}>Level 3</option>
                <option value={4}>Level 4</option>
                <option value={5}>Level 5</option>
              </select>
              <Button type="button" size="sm" variant="danger" onClick={() => removeSkillRow(idx)}>
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className={styles.nested}>
          <div className={styles.nestedHeader}>
            <h4>Calendar Entries</h4>
            <Button type="button" size="sm" variant="secondary" onClick={addCalendarRow}>
              + Add Entry
            </Button>
          </div>
          {calendarEntries.map((entry, idx) => (
            <div key={idx} className={styles.nestedRow}>
              <input
                type="date"
                value={entry.entryDate}
                onChange={(e) => updateCalendarRow(idx, "entryDate", e.target.value)}
                className={styles.nestedInput}
              />
              <select
                value={entry.entryType}
                onChange={(e) => updateCalendarRow(idx, "entryType", e.target.value)}
                className={styles.nestedSelect}
              >
                <option value="LEAVE">Leave</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="TRAINING">Training</option>
                <option value="PARTIAL_DAY">Partial Day</option>
                <option value="AVAILABLE">Available</option>
              </select>
              <Button type="button" size="sm" variant="danger" onClick={() => removeCalendarRow(idx)}>
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button type="submit" loading={loading}>
            Create Developer
          </Button>
          <Button type="button" variant="secondary" onClick={loadSample}>
            Load Sample
          </Button>
        </div>
      </form>

      {developers.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h4 style={{ marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>
            Created Developers
          </h4>
          <DataTable
            columns={[
              { header: "ID", accessor: (d: DeveloperResponse) => d.id, width: "60px" },
              { header: "Name", accessor: (d: DeveloperResponse) => d.name },
              { header: "Role", accessor: (d: DeveloperResponse) => d.role, width: "120px" },
              { header: "Seniority", accessor: (d: DeveloperResponse) => d.seniority, width: "100px" },
              { header: "Rate", accessor: (d: DeveloperResponse) => `$${d.hourlyRate}`, width: "80px" },
            ]}
            data={developers}
          />
        </div>
      )}
    </SectionCard>
  );
}
