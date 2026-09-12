package com.votelive.backend.controller;

import com.votelive.backend.dto.VoteRequest;
import com.votelive.backend.dto.VoteResultResponse;
import com.votelive.backend.entity.Vote;
import com.votelive.backend.service.VoteResultService;
import com.votelive.backend.service.VoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    private final VoteService voteService;
    private final VoteResultService voteResultService;

    public VoteController(
            VoteService voteService,
            VoteResultService voteResultService) {

        this.voteService = voteService;
        this.voteResultService = voteResultService;
    }

    @PostMapping
    public ResponseEntity<?> castVote(
            @RequestBody VoteRequest request,
            Authentication authentication) {

        try {
            Vote vote = voteService.castVote(
                    authentication.getName(),
                    request.getShowId(),
                    request.getContestantId()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Vote cast successfully",
                            "voteId", vote.getId(),
                            "showId", request.getShowId(),
                            "contestantId", request.getContestantId(),
                            "votedAt", vote.getVotedAt()
                    ));

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error", exception.getMessage()
                    ));
        }
    }

    @GetMapping("/results/show/{showId}")
    public ResponseEntity<List<VoteResultResponse>> getVoteResults(
            @PathVariable Long showId) {

        return ResponseEntity.ok(
                voteResultService.getResultsByShow(showId)
        );
    }

    @GetMapping("/my-vote/{showId}")
    public ResponseEntity<?> getMyVote(
            @PathVariable Long showId,
            Authentication authentication) {

        Vote vote = voteService.getMyVote(
                authentication.getName(),
                showId
        );

        if (vote == null) {
            return ResponseEntity.ok(
                    Map.of(
                            "hasVoted", false,
                            "showId", showId
                    )
            );
        }

        return ResponseEntity.ok(
                Map.of(
                        "hasVoted", true,
                        "showId", showId,
                        "contestantId", vote.getContestant().getId(),
                        "contestantName", vote.getContestant().getName(),
                        "votedAt", vote.getVotedAt()
                )
        );
    }

    @GetMapping("/analytics/show/{showId}")
    public ResponseEntity<?> getVoteAnalytics(
            @PathVariable Long showId) {

        List<VoteResultResponse> results =
                voteResultService.getResultsByShow(showId);

        long totalVotes = results.stream()
                .mapToLong(VoteResultResponse::getVoteCount)
                .sum();

        if (results.isEmpty() || totalVotes == 0) {

            return ResponseEntity.ok(
                    new com.votelive.backend.dto.VoteAnalyticsResponse(
                            0L,
                            null,
                            null,
                            0L,
                            0.0
                    )
            );
        }

        VoteResultResponse leader = results.get(0);

        return ResponseEntity.ok(
                new com.votelive.backend.dto.VoteAnalyticsResponse(
                        totalVotes,
                        leader.getContestantId(),
                        leader.getContestantName(),
                        leader.getVoteCount(),
                        leader.getVotePercentage()
                )
        );
    }
}