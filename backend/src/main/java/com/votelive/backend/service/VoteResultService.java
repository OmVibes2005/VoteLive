package com.votelive.backend.service;

import com.votelive.backend.dto.VoteResultResponse;
import com.votelive.backend.repository.VoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoteResultService {

    private final VoteRepository voteRepository;

    public VoteResultService(VoteRepository voteRepository) {
        this.voteRepository = voteRepository;
    }

    public List<VoteResultResponse> getResultsByShow(Long showId) {

        List<Object[]> results =
                voteRepository.getVoteResultsByShow(showId);

        long totalVotes = results.stream()
                .mapToLong(result -> (Long) result[2])
                .sum();

        long highestVotes = results.stream()
                .mapToLong(result -> (Long) result[2])
                .max()
                .orElse(0);

        int currentRank = 0;
        long previousVoteCount = -1;

        List<VoteResultResponse> response = new java.util.ArrayList<>();

        for (int i = 0; i < results.size(); i++) {

            Object[] result = results.get(i);

            Long contestantId = (Long) result[0];
            String contestantName = (String) result[1];
            Long voteCount = (Long) result[2];

            // Competition ranking:
            // 1, 2, 2, 4
            if (!voteCount.equals(previousVoteCount)) {
                currentRank = i + 1;
                previousVoteCount = voteCount;
            }

            double votePercentage = totalVotes == 0
                    ? 0.0
                    : (voteCount * 100.0) / totalVotes;

            boolean leading =
                    totalVotes > 0 &&
                            voteCount == highestVotes;

            response.add(
                    new VoteResultResponse(
                            currentRank,
                            contestantId,
                            contestantName,
                            voteCount,
                            Math.round(votePercentage * 100.0) / 100.0,
                            leading
                    )
            );
        }

        return response;
    }
}