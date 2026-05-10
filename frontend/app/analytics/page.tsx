"use client";

import { useState, useEffect } from "react";
import { createInitialPrediction, createMidSprintPrediction } from "@/lib/api";
import { addPrediction, loadWorkspace } from "@/lib/storage";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBanner from "@/components/StatusBanner";
import Button from "@/components/Button";
import styles from "./analytics.module.css";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const workspace = mounted ? loadWorkspace() : null;
  const activeSprint = workspace?.sprints.find((s) => s.status === "ACTIVE") || workspace?.sprints[0];
  const predictions = activeSprint && workspace
    ? workspace.predictions.filter((p) => p.sprintId === activeSprint.id)
    : [];

  const initialPrediction = predictions.find((p) => p.predictionType === "INITIAL");
  const midPredictions = predictions.filter((p) => p.predictionType === "MID_SPRINT");
  const latestPrediction = predictions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  const handleRunInitial = async () => {
    if (!activeSprint) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Running initial prediction for sprint:", activeSprint.id);
      const result = await createInitialPrediction({ sprintId: activeSprint.id });
      console.log("Prediction result:", result);
      addPrediction(result);
      setSuccess(true);
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      console.error("Prediction error:", err);
      setError(err.error || err.message || "Failed to run prediction");
    } finally {
      setLoading(false);
    }
  };

  const handleRunMid = async () => {
    if (!activeSprint) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const today = new Date().toISOString().split("T")[0];
      console.log("Running mid-sprint prediction for sprint:", activeSprint.id, "date:", today);
      const result = await createMidSprintPrediction({
        sprintId: activeSprint.id,
        snapshotDate: today,
      });
      console.log("Prediction result:", result);
      addPrediction(result);
      setSuccess(true);
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      console.error("Prediction error:", err);
      setError(err.error || err.message || "Failed to run prediction");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !workspace) {
    return null;
  }

  if (!activeSprint) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h2>No Active Sprint</h2>
          <p>Create a sprint to run cost predictions</p>
        </div>
      </div>
    );
  }

  const costChange =
    initialPrediction && latestPrediction && latestPrediction.id !== initialPrediction.id
      ? ((latestPrediction.predictedCost - initialPrediction.predictedCost) /
          initialPrediction.predictedCost) *
        100
      : null;

  return (
    <div className={styles.container} key={refreshKey}>
      <div className={styles.header}>
        <h1 className={styles.title}>Cost Analytics</h1>
        <p className={styles.subtitle}>Sprint: {activeSprint.name}</p>
      </div>

      {error && <StatusBanner type="error" message={error} />}
      {success && <StatusBanner type="success" message="Prediction completed successfully!" />}

      <div className={styles.predictionCard}>
        <h2 className={styles.cardTitle}>Current Sprint Prediction</h2>

        {latestPrediction ? (
          <>
            <div className={styles.costDisplay}>
              <div className={styles.costLabel}>Predicted Sprint Cost</div>
              <div className={styles.costValue}>
                {formatCurrency(latestPrediction.predictedCost)}
              </div>

              {costChange !== null && (
                <div className={styles.costChange}>
                  {initialPrediction && (
                    <span>
                      Initial: {formatCurrency(initialPrediction.predictedCost)} →{" "}
                      {latestPrediction.predictionType === "MID_SPRINT" && "Mid-Sprint:"}{" "}
                      {formatCurrency(latestPrediction.predictedCost)}
                    </span>
                  )}
                  <span
                    className={costChange < 0 ? styles.costDecrease : styles.costIncrease}
                  >
                    {costChange > 0 ? "↑" : "↓"} {Math.abs(costChange).toFixed(1)}%{" "}
                    {costChange < 0 ? "(better than planned)" : "(over budget)"}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.predictionMeta}>
              <div>Last Updated: {formatDate(latestPrediction.createdAt)}</div>
              <div>Model: {latestPrediction.modelVersion}</div>
              <div>Type: {latestPrediction.predictionType}</div>
            </div>
          </>
        ) : (
          <div className={styles.noPrediction}>
            <p>No predictions yet for this sprint</p>
            <p className={styles.hint}>Run an initial prediction to get started</p>
          </div>
        )}

        <div className={styles.actions}>
          <Button
            onClick={handleRunInitial}
            loading={loading}
            disabled={!!initialPrediction}
          >
            {initialPrediction ? "✓ Initial Prediction Complete" : "🔄 Run Initial Prediction"}
          </Button>
          <Button
            onClick={handleRunMid}
            loading={loading}
            variant="secondary"
            disabled={!initialPrediction}
          >
            🔄 Run Mid-Sprint Update
          </Button>
        </div>
      </div>

      {predictions.length > 0 && (
        <div className={styles.historyCard}>
          <h2 className={styles.cardTitle}>Prediction History</h2>

          <div className={styles.historyList}>
            {predictions
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((pred) => (
                <div key={pred.id} className={styles.historyItem}>
                  <div className={styles.historyType}>
                    {pred.predictionType === "INITIAL" ? "📊" : "📈"}{" "}
                    {pred.predictionType.replace("_", " ")}
                  </div>
                  <div className={styles.historyCost}>
                    {formatCurrency(pred.predictedCost)}
                  </div>
                  <div className={styles.historyDate}>{formatDate(pred.createdAt)}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
