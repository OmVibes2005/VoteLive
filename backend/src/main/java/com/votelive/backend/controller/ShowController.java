package com.votelive.backend.controller;

import com.votelive.backend.dto.ShowRequest;
import com.votelive.backend.entity.Show;
import com.votelive.backend.repository.ShowRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    private final ShowRepository showRepository;

    public ShowController(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createShow(
            @RequestBody ShowRequest request) {

        Show show = new Show(
                request.getTitle(),
                request.getDescription()
        );

        Show savedShow = showRepository.save(show);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Show created successfully",
                        "showId", savedShow.getId(),
                        "title", savedShow.getTitle(),
                        "description", savedShow.getDescription(),
                        "votingActive", savedShow.isVotingActive()
                ));
    }
    @GetMapping
    public ResponseEntity<List<Show>> getAllShows() {

        return ResponseEntity.ok(
                showRepository.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getShowById(
            @PathVariable Long id) {

        return showRepository.findById(id)
                .<ResponseEntity<?>>map(
                        show -> ResponseEntity.ok(show)
                )
                .orElseGet(() ->
                        ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(Map.of(
                                        "error", "Show not found"
                                ))
                );
    }

    @PutMapping("/{id}/start")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> startVoting(
            @PathVariable Long id) {

        Show show = showRepository.findById(id)
                .orElse(null);

        if (show == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Show not found"
                    ));
        }

        show.setVotingActive(true);

        Show updatedShow = showRepository.save(show);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Voting started successfully",
                        "showId", updatedShow.getId(),
                        "votingActive", updatedShow.isVotingActive()
                )
        );
    }

    @PutMapping("/{id}/stop")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> stopVoting(
            @PathVariable Long id) {

        Show show = showRepository.findById(id)
                .orElse(null);

        if (show == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Show not found"
                    ));
        }

        show.setVotingActive(false);

        Show updatedShow = showRepository.save(show);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Voting stopped successfully",
                        "showId", updatedShow.getId(),
                        "votingActive", updatedShow.isVotingActive()
                )
        );
    }
}