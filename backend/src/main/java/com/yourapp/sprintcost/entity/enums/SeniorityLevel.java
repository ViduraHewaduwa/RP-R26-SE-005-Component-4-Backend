package com.yourapp.sprintcost.entity.enums;

public enum SeniorityLevel {
    JUNIOR(1),
    MID(3),
    SENIOR(5),
    LEAD(7);

    private final int indicativeYears;

    SeniorityLevel(int indicativeYears) {
        this.indicativeYears = indicativeYears;
    }

    public int getIndicativeYears() {
        return indicativeYears;
    }

    public double toModelValue() {
        return Math.log(indicativeYears + 1.0d);
    }
}
