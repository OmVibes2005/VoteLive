package com.votelive.backend.controller;

import com.votelive.backend.repository.ContestantRepository;
import com.votelive.backend.repository.ShowRepository;
import com.votelive.backend.repository.UserRepository;
import com.votelive.backend.repository.VoteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ShowRepository showRepository;
    private final ContestantRepository contestantRepository;
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;

    public AdminController(
            ShowRepository showRepository,
            ContestantRepository contestantRepository,
            VoteRepository voteRepository,
            UserRepository userRepository) {

        this.showRepository = showRepository;
        this.contestantRepository = contestantRepository;
        this.voteRepository = voteRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {

        long totalShows =
                showRepository.count();

        long activeShows =
                showRepository.countByVotingActiveTrue();

        long totalContestants =
                contestantRepository.count();

        long totalVotes =
                voteRepository.count();

        long totalUsers =
                userRepository.count();

        LocalDateTime startOfToday =
                LocalDate.now().atStartOfDay();

        long votesToday =
                voteRepository.countByVotedAtGreaterThanEqual(
                        startOfToday
                );

        return ResponseEntity.ok(
                Map.of(
                        "totalShows", totalShows,
                        "activeShows", activeShows,
                        "totalContestants", totalContestants,
                        "totalVotes", totalVotes,
                        "totalUsers", totalUsers,
                        "votesToday", votesToday
                )
        );
    }
}