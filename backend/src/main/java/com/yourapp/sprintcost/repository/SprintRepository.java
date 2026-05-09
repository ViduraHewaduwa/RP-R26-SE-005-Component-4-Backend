package com.yourapp.sprintcost.repository;

import com.yourapp.sprintcost.entity.Sprint;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SprintRepository extends JpaRepository<Sprint, Long> {

    List<Sprint> findByTeamIdOrderBySprintNumberAsc(Long teamId);
}
