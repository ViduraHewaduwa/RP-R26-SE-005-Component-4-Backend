package com.yourapp.sprintcost.repository;

import com.yourapp.sprintcost.entity.Team;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByCode(String code);
}
