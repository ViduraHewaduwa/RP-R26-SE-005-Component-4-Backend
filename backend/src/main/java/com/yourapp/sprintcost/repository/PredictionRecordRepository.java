package com.yourapp.sprintcost.repository;

import com.yourapp.sprintcost.entity.PredictionRecord;
import com.yourapp.sprintcost.entity.enums.PredictionType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PredictionRecordRepository extends JpaRepository<PredictionRecord, Long> {

    List<PredictionRecord> findBySprintIdOrderByCreatedAtDesc(Long sprintId);

    Optional<PredictionRecord> findTopBySprintIdAndPredictionTypeOrderByCreatedAtDesc(Long sprintId, PredictionType predictionType);
}
