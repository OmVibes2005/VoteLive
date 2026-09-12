package com.votelive.backend.controller;

import com.votelive.backend.repository.ContestantRepository;
import com.votelive.backend.repository.ShowRepository;
import com.votelive.backend.repository.VoteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ShowRepository showRepository;
    private final ContestantRepository contestantRepository;
    private final VoteRepository voteRepository;

    public AdminController(
            ShowRepository showRepository,
            ContestantRepository contestantRepository,
            VoteRepository voteRepository) {

        this.showRepository = showRepository;
        this.contestantRepository = contestantRepository;
        this.voteRepository = voteRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {

        long totalShows = showRepository.count();

        long activeShows =
                showRepository.countByVotingActiveTrue();

        long totalContestants =
                contestantRepository.count();

        long totalVotes =
                voteRepository.count();

        return ResponseEntity.ok(
                Map.of(
                        "totalShows", totalShows,
                        "activeShows", activeShows,
                        "totalContestants", totalContestants,
                        "totalVotes", totalVotes
                )
        );
    }
}