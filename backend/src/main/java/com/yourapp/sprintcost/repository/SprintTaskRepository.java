package com.yourapp.sprintcost.repository;

import com.yourapp.sprintcost.entity.SprintTask;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SprintTaskRepository extends JpaRepository<SprintTask, Long> {

    List<SprintTask> findBySprintId(Long sprintId);
}
