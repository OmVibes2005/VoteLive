package com.votelive.backend.controller;

import com.votelive.backend.dto.ContestantRequest;
import com.votelive.backend.dto.ContestantResponse;
import com.votelive.backend.entity.Contestant;
import com.votelive.backend.entity.Show;
import com.votelive.backend.repository.ContestantRepository;
import com.votelive.backend.repository.ShowRepository;
import com.votelive.backend.repository.VoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contestants")
public class ContestantController {

    private final ContestantRepository contestantRepository;
    private final ShowRepository showRepository;
    private final VoteRepository voteRepository;

    public ContestantController(
            ContestantRepository contestantRepository,
            ShowRepository showRepository,
            VoteRepository voteRepository) {

        this.contestantRepository = contestantRepository;
        this.showRepository = showRepository;
        this.voteRepository = voteRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createContestant(
            @RequestBody ContestantRequest request) {

        Show show = showRepository.findById(request.getShowId())
                .orElse(null);

        if (show == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Show not found"
                    ));
        }

        Contestant contestant = new Contestant();

        contestant.setName(request.getName());
        contestant.setDescription(request.getDescription());
        contestant.setImageUrl(request.getImageUrl());
        contestant.setShow(show);

        Contestant savedContestant =
                contestantRepository.save(contestant);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Contestant added successfully",
                        "contestantId", savedContestant.getId(),
                        "name", savedContestant.getName(),
                        "description", savedContestant.getDescription(),
                        "imageUrl", savedContestant.getImageUrl(),
                        "showId", show.getId()
                ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateContestant(
            @PathVariable Long id,
            @RequestBody ContestantRequest request) {

        Contestant contestant = contestantRepository.findById(id)
                .orElse(null);

        if (contestant == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Contestant not found"
                    ));
        }

        Show show = showRepository.findById(request.getShowId())
                .orElse(null);

        if (show == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Show not found"
                    ));
        }

        contestant.setName(request.getName());
        contestant.setDescription(request.getDescription());
        contestant.setImageUrl(request.getImageUrl());
        contestant.setShow(show);

        Contestant updatedContestant =
                contestantRepository.save(contestant);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Contestant updated successfully",
                        "contestantId", updatedContestant.getId(),
                        "name", updatedContestant.getName(),
                        "description", updatedContestant.getDescription(),
                        "imageUrl", updatedContestant.getImageUrl(),
                        "showId", show.getId()
                )
        );
    }

    @GetMapping("/show/{showId}")
    public ResponseEntity<?> getContestantsByShow(
            @PathVariable Long showId) {

        if (!showRepository.existsById(showId)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Show not found"
                    ));
        }

        List<ContestantResponse> contestants =
                contestantRepository.findByShowId(showId)
                        .stream()
                        .map(contestant ->
                                new ContestantResponse(
                                        contestant.getId(),
                                        contestant.getName(),
                                        contestant.getDescription(),
                                        contestant.getImageUrl(),
                                        contestant.getShow().getId()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(contestants);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteContestant(
            @PathVariable Long id) {

        Contestant contestant = contestantRepository.findById(id)
                .orElse(null);

        if (contestant == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Contestant not found"
                    ));
        }

        if (voteRepository.existsByContestantId(id)) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            "Cannot delete contestant because votes already exist"
                    ));
        }

        contestantRepository.delete(contestant);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Contestant deleted successfully",
                        "contestantId", id
                )
        );
    }
}