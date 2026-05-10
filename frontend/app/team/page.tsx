"use client";

import { useState, useEffect } from "react";
import { loadWorkspace } from "@/lib/storage";
import type { DeveloperResponse } from "@/lib/types";
import styles from "./team.module.css";

export default function TeamManagementPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const workspace = mounted ? loadWorkspace() : null;
  const team = workspace?.teams[0];
  const developers = workspace?.developers || [];
  const skills = workspace?.skills || [];

  if (!mounted || !workspace) {
    return null;
  }

  const getSkillCoverage = (role: string) => {
    const count = developers.filter((d) => d.role === role).length;
    const percent = developers.length > 0 ? (count / developers.length) * 100 : 0;
    return { count, percent };
  };

  const roleStats = [
    { role: "Backend", ...getSkillCoverage("BACKEND") },
    { role: "Frontend", ...getSkillCoverage("FRONTEND") },
    { role: "Full Stack", ...getSkillCoverage("FULL_STACK") },
    { role: "QA", ...getSkillCoverage("QA") },
    { role: "DevOps", ...getSkillCoverage("DEVOPS") },
    { role: "Architect", ...getSkillCoverage("ARCHITECT") },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Team: {team?.name || "No Team"}</h1>
          {team && <p className={styles.subtitle}>{team.code} • {team.description}</p>}
        </div>
        <button className={styles.primaryButton}>+ Add Developer</button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Team Members ({developers.length})</h2>

        <div className={styles.membersList}>
          {developers.map((dev) => (
            <DeveloperCard key={dev.id} developer={dev} />
          ))}

          {developers.length === 0 && (
            <div className={styles.emptyState}>
              <p>No team members yet</p>
              <button className={styles.secondaryButton}>Add Your First Developer</button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Team Skills Coverage</h2>

        <div className={styles.skillsGrid}>
          {roleStats.map((stat) => (
            <div key={stat.role} className={styles.skillCard}>
              <div className={styles.skillHeader}>
                <span className={styles.skillName}>{stat.role}</span>
                <span className={styles.skillCount}>{stat.count} developers</span>
              </div>
              <div className={styles.skillBar}>
                <div
                  className={styles.skillFill}
                  style={{ width: `${stat.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Available Skills ({skills.length})</h2>

        <div className={styles.skillTags}>
          {skills.map((skill) => (
            <div key={skill.id} className={styles.skillTag}>
              {skill.name}
            </div>
          ))}

          {skills.length === 0 && (
            <p className={styles.emptyText}>No skills defined yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DeveloperCard({ developer }: { developer: DeveloperResponse }) {
  const availability = developer.allocationPercent / 100;

  return (
    <div className={styles.memberCard}>
      <div className={styles.memberHeader}>
        <div className={styles.memberInfo}>
          <span className={styles.memberIcon}>👤</span>
          <div>
            <h3 className={styles.memberName}>{developer.name}</h3>
            <p className={styles.memberRole}>
              {developer.seniority} {developer.role.replace("_", " ")} Developer
            </p>
          </div>
        </div>
        <div className={styles.memberRate}>${developer.hourlyRate}/hr</div>
      </div>

      {developer.skills.length > 0 && (
        <div className={styles.memberSkills}>
          <span className={styles.memberSkillsLabel}>Skills:</span>
          {developer.skills.map((skill, idx) => (
            <span key={idx} className={styles.memberSkill}>
              {skill.skillName} {"⭐".repeat(skill.proficiencyLevel)}
            </span>
          ))}
        </div>
      )}

      <div className={styles.memberFooter}>
        <div className={styles.memberStat}>
          <span className={styles.memberStatLabel}>Allocation:</span>
          <span className={styles.memberStatValue}>{developer.allocationPercent}%</span>
        </div>
        <div className={styles.memberStat}>
          <span className={styles.memberStatLabel}>Availability:</span>
          <div className={styles.availabilityBar}>
            <div
              className={styles.availabilityFill}
              style={{ width: `${availability * 100}%` }}
            ></div>
          </div>
          <span className={styles.memberStatValue}>{(availability * 100).toFixed(0)}%</span>
        </div>
      </div>

      {developer.calendarEntries.length > 0 && (
        <div className={styles.memberCalendar}>
          📅 Upcoming: {developer.calendarEntries[0].entryType} on {developer.calendarEntries[0].entryDate}
        </div>
      )}
    </div>
  );
}
