package com.votelive.backend.repository;

import com.votelive.backend.entity.Contestant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContestantRepository
        extends JpaRepository<Contestant, Long> {

    List<Contestant> findByShowId(Long showId);
}