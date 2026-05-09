package com.yourapp.sprintcost.repository;

import com.yourapp.sprintcost.entity.SprintAssignment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SprintAssignmentRepository extends JpaRepository<SprintAssignment, Long> {

    List<SprintAssignment> findByTaskSprintId(Long sprintId);
}
