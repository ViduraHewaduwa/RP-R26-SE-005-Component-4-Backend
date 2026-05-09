"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";
import Field from "@/components/Field";
import Button from "@/components/Button";
import StatusBanner from "@/components/StatusBanner";
import DataTable from "@/components/DataTable";
import JsonBlock from "@/components/JsonBlock";
import { createInitialPrediction, createMidSprintPrediction, getPredictionsBySprint as fetchPredictions } from "@/lib/api";
import { addPrediction, getSprints, getPredictionsBySprint } from "@/lib/storage";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PredictionResponse } from "@/lib/types";

interface PredictionsSectionProps {
  onUpdate: () => void;
}

export default function PredictionsSection({ onUpdate }: PredictionsSectionProps) {
  const [initialSprintId, setInitialSprintId] = useState("");
  const [initialLoading, setInitialLoading] = useState(false);
  const [initialError, setInitialError] = useState<{ message: string; details: string[] } | null>(null);
  const [initialSuccess, setInitialSuccess] = useState(false);

  const [midSprintId, setMidSprintId] = useState("");
  const [midSnapshotDate, setMidSnapshotDate] = useState("2026-05-08");
  const [midLoading, setMidLoading] = useState(false);
  const [midError, setMidError] = useState<{ message: string; details: string[] } | null>(null);
  const [midSuccess, setMidSuccess] = useState(false);

  const [historySprintId, setHistorySprintId] = useState("");
  const [historyData, setHistoryData] = useState<PredictionResponse[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const sprints = getSprints();
  const localPredictions = getPredictionsBySprint(historySprintId ? parseInt(historySprintId) : 0);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInitialLoading(true);
    setInitialError(null);
    setInitialSuccess(false);

    try {
      const result = await createInitialPrediction({ sprintId: parseInt(initialSprintId) });
      addPrediction(result);
      setInitialSuccess(true);
      onUpdate();
    } catch (err: any) {
      setInitialError({
        message: err.error || "Failed to create initial prediction",
        details: err.details || [],
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleMidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMidLoading(true);
    setMidError(null);
    setMidSuccess(false);

    try {
      const result = await createMidSprintPrediction({
        sprintId: parseInt(midSprintId),
        snapshotDate: midSnapshotDate,
      });
      addPrediction(result);
      setMidSuccess(true);
      onUpdate();
    } catch (err: any) {
      setMidError({
        message: err.error || "Failed to create mid-sprint prediction",
        details: err.details || [],
      });
    } finally {
      setMidLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const data = await fetchPredictions(parseInt(historySprintId));
      setHistoryData(data);
    } catch (err: any) {
      setHistoryError(err.error || "Failed to fetch prediction history");
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <>
      <SectionCard
        title="Initial Prediction"
        subtitle="Run initial cost prediction for a sprint"
        collapsible
      >
        <form onSubmit={handleInitialSubmit}>
          {initialError && (
            <StatusBanner type="error" message={initialError.message} details={initialError.details} />
          )}
          {initialSuccess && (
            <StatusBanner type="success" message="Initial prediction created successfully" />
          )}

          <Field
            type="select"
            label="Sprint"
            required
            selectProps={{
              value: initialSprintId,
              onChange: (e) => setInitialSprintId(e.target.value),
            }}
          >
            <option value="">Select a sprint</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.teamCode})
              </option>
            ))}
          </Field>

          <Button type="submit" loading={initialLoading} disabled={!initialSprintId}>
            Run Initial Prediction
          </Button>
        </form>
      </SectionCard>

      <SectionCard
        title="Mid-Sprint Prediction"
        subtitle="Update prediction with mid-sprint data"
        collapsible
      >
        <form onSubmit={handleMidSubmit}>
          {midError && (
            <StatusBanner type="error" message={midError.message} details={midError.details} />
          )}
          {midSuccess && (
            <StatusBanner type="success" message="Mid-sprint prediction created successfully" />
          )}

          <Field
            type="select"
            label="Sprint"
            required
            selectProps={{
              value: midSprintId,
              onChange: (e) => setMidSprintId(e.target.value),
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
            label="Snapshot Date"
            required
            inputProps={{
              type: "date",
              value: midSnapshotDate,
              onChange: (e) => setMidSnapshotDate(e.target.value),
            }}
          />

          <Button type="submit" loading={midLoading} disabled={!midSprintId}>
            Run Mid-Sprint Prediction
          </Button>
        </form>
      </SectionCard>

      <SectionCard
        title="Prediction History"
        subtitle="View all predictions for a sprint"
        collapsible
      >
        <Field
          type="select"
          label="Sprint"
          required
          selectProps={{
            value: historySprintId,
            onChange: (e) => setHistorySprintId(e.target.value),
          }}
        >
          <option value="">Select a sprint</option>
          {sprints.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.teamCode})
            </option>
          ))}
        </Field>

        <Button onClick={fetchHistory} loading={historyLoading} disabled={!historySprintId}>
          Fetch History
        </Button>

        {historyError && <StatusBanner type="error" message={historyError} />}

        {historyData.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <DataTable
              columns={[
                { header: "ID", accessor: (p: PredictionResponse) => p.id, width: "60px" },
                { header: "Type", accessor: (p: PredictionResponse) => p.predictionType, width: "120px" },
                {
                  header: "Predicted Cost",
                  accessor: (p: PredictionResponse) => (
                    <strong style={{ color: "#059669", fontSize: "1rem" }}>
                      {formatCurrency(p.predictedCost)}
                    </strong>
                  ),
                  width: "140px",
                },
                { header: "Model", accessor: (p: PredictionResponse) => p.modelVersion, width: "100px" },
                { header: "Snapshot", accessor: (p: PredictionResponse) => formatDate(p.snapshotDate), width: "120px" },
                { header: "Created", accessor: (p: PredictionResponse) => formatDate(p.createdAt), width: "120px" },
              ]}
              data={historyData}
            />

            {historyData.map((pred) => (
              <JsonBlock
                key={pred.id}
                title={`Feature Snapshot - ${pred.predictionType} (ID: ${pred.id})`}
                data={pred.featureSnapshot}
              />
            ))}
          </div>
        )}

        {localPredictions.length > 0 && historyData.length === 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <h4 style={{ marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>
              Local Predictions (from localStorage)
            </h4>
            <DataTable
              columns={[
                { header: "ID", accessor: (p: PredictionResponse) => p.id, width: "60px" },
                { header: "Type", accessor: (p: PredictionResponse) => p.predictionType, width: "120px" },
                {
                  header: "Predicted Cost",
                  accessor: (p: PredictionResponse) => (
                    <strong style={{ color: "#059669", fontSize: "1rem" }}>
                      {formatCurrency(p.predictedCost)}
                    </strong>
                  ),
                  width: "140px",
                },
                { header: "Model", accessor: (p: PredictionResponse) => p.modelVersion, width: "100px" },
                { header: "Snapshot", accessor: (p: PredictionResponse) => formatDate(p.snapshotDate), width: "120px" },
              ]}
              data={localPredictions}
            />
          </div>
        )}
      </SectionCard>
    </>
  );
}
