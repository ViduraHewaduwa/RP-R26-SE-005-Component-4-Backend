"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";
import Field from "@/components/Field";
import Button from "@/components/Button";
import StatusBanner from "@/components/StatusBanner";
import { getTeamVelocity, getDeveloperAvailability, getSprintFeatures } from "@/lib/api";
import { getTeams, getDevelopers, getSprints } from "@/lib/storage";
import type { VelocityResponse, AvailabilityResponse, SprintFeatureResponse } from "@/lib/types";
import styles from "./AnalyticsSection.module.css";

export default function AnalyticsSection() {
  const [velocityTeamId, setVelocityTeamId] = useState("");
  const [velocityData, setVelocityData] = useState<VelocityResponse | null>(null);
  const [velocityLoading, setVelocityLoading] = useState(false);
  const [velocityError, setVelocityError] = useState<string | null>(null);

  const [availDeveloperId, setAvailDeveloperId] = useState("");
  const [availSprintId, setAvailSprintId] = useState("");
  const [availData, setAvailData] = useState<AvailabilityResponse | null>(null);
  const [availLoading, setAvailLoading] = useState(false);
  const [availError, setAvailError] = useState<string | null>(null);

  const [featuresSprintId, setFeaturesSprintId] = useState("");
  const [featuresSnapshotDate, setFeaturesSnapshotDate] = useState("");
  const [featuresData, setFeaturesData] = useState<SprintFeatureResponse | null>(null);
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [featuresError, setFeaturesError] = useState<string | null>(null);

  const teams = getTeams();
  const developers = getDevelopers();
  const sprints = getSprints();

  const fetchVelocity = async () => {
    setVelocityLoading(true);
    setVelocityError(null);
    try {
      const data = await getTeamVelocity(parseInt(velocityTeamId));
      setVelocityData(data);
    } catch (err: any) {
      setVelocityError(err.error || "Failed to fetch velocity");
    } finally {
      setVelocityLoading(false);
    }
  };

  const fetchAvailability = async () => {
    setAvailLoading(true);
    setAvailError(null);
    try {
      const data = await getDeveloperAvailability(parseInt(availDeveloperId), parseInt(availSprintId));
      setAvailData(data);
    } catch (err: any) {
      setAvailError(err.error || "Failed to fetch availability");
    } finally {
      setAvailLoading(false);
    }
  };

  const fetchFeatures = async () => {
    setFeaturesLoading(true);
    setFeaturesError(null);
    try {
      const data = await getSprintFeatures(
        parseInt(featuresSprintId),
        featuresSnapshotDate || undefined
      );
      setFeaturesData(data);
    } catch (err: any) {
      setFeaturesError(err.error || "Failed to fetch features");
    } finally {
      setFeaturesLoading(false);
    }
  };

  return (
    <>
      <SectionCard title="Team Velocity" subtitle="View historical velocity for a team" collapsible>
        <Field
          type="select"
          label="Team"
          required
          selectProps={{
            value: velocityTeamId,
            onChange: (e) => setVelocityTeamId(e.target.value),
          }}
        >
          <option value="">Select a team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.code} - {t.name}
            </option>
          ))}
        </Field>

        <Button onClick={fetchVelocity} loading={velocityLoading} disabled={!velocityTeamId}>
          Fetch Velocity
        </Button>

        {velocityError && <StatusBanner type="error" message={velocityError} />}

        {velocityData && (
          <div className={styles.result}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Team Code</div>
              <div className={styles.statValue}>{velocityData.teamCode}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Historical Velocity Avg</div>
              <div className={styles.statValue}>{velocityData.historicalVelocityAvg.toFixed(2)}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Story Point History</div>
              <div className={styles.statValue}>
                {velocityData.completedStoryPointHistory.join(", ") || "None"}
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Developer Availability"
        subtitle="Check developer availability for a sprint"
        collapsible
      >
        <Field
          type="select"
          label="Developer"
          required
          selectProps={{
            value: availDeveloperId,
            onChange: (e) => setAvailDeveloperId(e.target.value),
          }}
        >
          <option value="">Select a developer</option>
          {developers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Field>

        <Field
          type="select"
          label="Sprint"
          required
          selectProps={{
            value: availSprintId,
            onChange: (e) => setAvailSprintId(e.target.value),
          }}
        >
          <option value="">Select a sprint</option>
          {sprints.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Field>

        <Button
          onClick={fetchAvailability}
          loading={availLoading}
          disabled={!availDeveloperId || !availSprintId}
        >
          Fetch Availability
        </Button>

        {availError && <StatusBanner type="error" message={availError} />}

        {availData && (
          <div className={styles.result}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Availability Rate</div>
              <div className={styles.statValue}>{(availData.availabilityRate * 100).toFixed(1)}%</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Planned Absence Days</div>
              <div className={styles.statValue}>{availData.plannedAbsenceDays}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Available Capacity Days</div>
              <div className={styles.statValue}>{availData.availableCapacityDays.toFixed(1)}</div>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Sprint Engineered Features"
        subtitle="View support metrics and model features for a sprint"
        collapsible
      >
        <Field
          type="select"
          label="Sprint"
          required
          selectProps={{
            value: featuresSprintId,
            onChange: (e) => setFeaturesSprintId(e.target.value),
          }}
        >
          <option value="">Select a sprint</option>
          {sprints.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Field>

        <Field
          type="input"
          label="Snapshot Date (optional)"
          hint="Leave empty to use current date bounded to sprint end"
          inputProps={{
            type: "date",
            value: featuresSnapshotDate,
            onChange: (e) => setFeaturesSnapshotDate(e.target.value),
          }}
        />

        <Button onClick={fetchFeatures} loading={featuresLoading} disabled={!featuresSprintId}>
          Fetch Features
        </Button>

        {featuresError && <StatusBanner type="error" message={featuresError} />}

        {featuresData && (
          <div className={styles.featuresResult}>
            <h4 className={styles.subsectionTitle}>Support Metrics</h4>
            <div className={styles.metricsGrid}>
              {Object.entries(featuresData.supportMetrics).map(([key, value]) => (
                <div key={key} className={styles.metricCard}>
                  <div className={styles.metricLabel}>{key}</div>
                  <div className={styles.metricValue}>{value}</div>
                </div>
              ))}
            </div>

            <h4 className={styles.subsectionTitle}>Initial Model Features</h4>
            <div className={styles.featureTable}>
              {Object.entries(featuresData.initialModelFeatures).map(([key, value]) => (
                <div key={key} className={styles.featureRow}>
                  <span className={styles.featureKey}>{key}</span>
                  <span className={styles.featureValue}>{value}</span>
                </div>
              ))}
            </div>

            <h4 className={styles.subsectionTitle}>Mid-Sprint Model Features</h4>
            <div className={styles.featureTable}>
              {Object.entries(featuresData.midModelFeatures).map(([key, value]) => (
                <div key={key} className={styles.featureRow}>
                  <span className={styles.featureKey}>{key}</span>
                  <span className={styles.featureValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </>
  );
}
