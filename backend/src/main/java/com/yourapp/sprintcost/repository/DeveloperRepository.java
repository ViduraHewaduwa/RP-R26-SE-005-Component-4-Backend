package com.yourapp.sprintcost.repository;

import com.yourapp.sprintcost.entity.Developer;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeveloperRepository extends JpaRepository<Developer, Long> {

    List<Developer> findByTeamId(Long teamId);
}
