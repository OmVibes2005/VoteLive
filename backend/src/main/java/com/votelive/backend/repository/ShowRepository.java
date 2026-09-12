package com.votelive.backend.repository;

import com.votelive.backend.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowRepository extends JpaRepository<Show, Long> {

    long countByVotingActiveTrue();

}