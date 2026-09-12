package com.votelive.backend.service;

import com.votelive.backend.entity.Contestant;
import com.votelive.backend.entity.Show;
import com.votelive.backend.entity.User;
import com.votelive.backend.entity.Vote;
import com.votelive.backend.repository.ContestantRepository;
import com.votelive.backend.repository.ShowRepository;
import com.votelive.backend.repository.UserRepository;
import com.votelive.backend.repository.VoteRepository;
import org.springframework.stereotype.Service;

@Service
public class VoteService {

    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final ContestantRepository contestantRepository;
    private final ShowRepository showRepository;
    private final VoteResultPublisher voteResultPublisher;

    public VoteService(
            VoteRepository voteRepository,
            UserRepository userRepository,
            ContestantRepository contestantRepository,
            ShowRepository showRepository,
            VoteResultPublisher voteResultPublisher) {

        this.voteRepository = voteRepository;
        this.userRepository = userRepository;
        this.contestantRepository = contestantRepository;
        this.showRepository = showRepository;
        this.voteResultPublisher = voteResultPublisher;
    }

    public Vote castVote(
            String email,
            Long showId,
            Long contestantId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Show show = showRepository.findById(showId)
                .orElseThrow(() ->
                        new RuntimeException("Show not found")
                );

        if (!show.isVotingActive()) {
            throw new RuntimeException(
                    "Voting is currently closed"
            );
        }

        Contestant contestant =
                contestantRepository.findById(contestantId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Contestant not found"
                                )
                        );

        if (!contestant.getShow().getId().equals(showId)) {
            throw new RuntimeException(
                    "Contestant does not belong to this show"
            );
        }

        // One vote per user per show
        if (voteRepository.findUserVoteForShow(
                user.getId(),
                showId
        ).isPresent()) {

            throw new RuntimeException(
                    "You have already voted in this show"
            );
        }

        // Create vote
        Vote vote = new Vote(
                user,
                contestant,
                show
        );

        // Save vote to database
        Vote savedVote = voteRepository.save(vote);

        // Broadcast updated results to all connected clients
        voteResultPublisher.publishResults(showId);

        return savedVote;
    }

    public Vote getMyVote(
            String email,
            Long showId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return voteRepository.findUserVoteForShow(
                user.getId(),
                showId
        ).orElse(null);
    }
}