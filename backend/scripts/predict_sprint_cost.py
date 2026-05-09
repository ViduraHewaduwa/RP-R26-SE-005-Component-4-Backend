#!/usr/bin/env python3
"""Load saved sprint cost artifacts and return a single prediction."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import joblib
import pandas as pd


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Predict sprint cost from saved model artifacts.")
    parser.add_argument("--stage", choices=["initial", "mid"], required=True)
    parser.add_argument("--input-json", type=Path, required=True)
    parser.add_argument("--artifacts-root", type=Path, required=True)
    parser.add_argument("--training-module-root", type=Path, required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    sys.path.insert(0, str(args.training_module_root.resolve()))
    from train_backend_sprint_cost_model import StageFeatureEngineer  # pylint: disable=import-outside-toplevel

    sys.modules["__main__"].StageFeatureEngineer = StageFeatureEngineer

    payload = json.loads(args.input_json.read_text())
    frame = pd.DataFrame([payload])
    model_path = args.artifacts_root / f"{args.stage}_model" / "model.joblib"
    model = joblib.load(model_path)
    predicted_value = float(model.predict(frame)[0])
    print(json.dumps({
        "stage": args.stage,
        "predictedCost": predicted_value,
        "modelPath": str(model_path.resolve()),
    }))


if __name__ == "__main__":
    main()
