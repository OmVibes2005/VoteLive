package com.votelive.backend.repository;

import com.votelive.backend.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    boolean existsByContestantId(Long contestantId);

    @Query("""
            SELECT v.contestant.id, v.contestant.name, COUNT(v.id)
            FROM Contestant c
            LEFT JOIN Vote v ON v.contestant.id = c.id
            WHERE c.show.id = :showId
            GROUP BY c.id, c.name
            ORDER BY COUNT(v.id) DESC
            """)
    List<Object[]> getVoteResultsByShow(
            @Param("showId") Long showId
    );

    @Query("""
            SELECT v
            FROM Vote v
            WHERE v.user.id = :userId
            AND v.show.id = :showId
            """)
    Optional<Vote> findUserVoteForShow(
            @Param("userId") Long userId,
            @Param("showId") Long showId
    );
}