package com.yourapp.sprintcost.repository;

import com.yourapp.sprintcost.entity.DeveloperCalendar;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeveloperCalendarRepository extends JpaRepository<DeveloperCalendar, Long> {

    List<DeveloperCalendar> findByDeveloperIdAndEntryDateBetween(Long developerId, LocalDate startDate, LocalDate endDate);
}
