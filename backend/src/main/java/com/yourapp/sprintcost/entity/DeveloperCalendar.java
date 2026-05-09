package com.yourapp.sprintcost.entity;

import com.yourapp.sprintcost.entity.enums.CalendarEntryType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "developer_calendar")
public class DeveloperCalendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "developer_id")
    private Developer developer;

    private LocalDate entryDate;

    @Enumerated(EnumType.STRING)
    private CalendarEntryType entryType;

    private Double availabilityFactor;

    private String note;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Developer getDeveloper() {
        return developer;
    }

    public void setDeveloper(Developer developer) {
        this.developer = developer;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public CalendarEntryType getEntryType() {
        return entryType;
    }

    public void setEntryType(CalendarEntryType entryType) {
        this.entryType = entryType;
    }

    public Double getAvailabilityFactor() {
        return availabilityFactor;
    }

    public void setAvailabilityFactor(Double availabilityFactor) {
        this.availabilityFactor = availabilityFactor;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
