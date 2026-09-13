package com.votelive.backend.dto;

import java.time.LocalDateTime;

public class VoteHistoryResponse {

    private Long voteId;
    private Long showId;
    private String showTitle;
    private Long contestantId;
    private String contestantName;
    private LocalDateTime votedAt;

    public VoteHistoryResponse() {
    }

    public VoteHistoryResponse(
            Long voteId,
            Long showId,
            String showTitle,
            Long contestantId,
            String contestantName,
            LocalDateTime votedAt) {

        this.voteId = voteId;
        this.showId = showId;
        this.showTitle = showTitle;
        this.contestantId = contestantId;
        this.contestantName = contestantName;
        this.votedAt = votedAt;
    }

    public Long getVoteId() {
        return voteId;
    }

    public void setVoteId(Long voteId) {
        this.voteId = voteId;
    }

    public Long getShowId() {
        return showId;
    }

    public void setShowId(Long showId) {
        this.showId = showId;
    }

    public String getShowTitle() {
        return showTitle;
    }

    public void setShowTitle(String showTitle) {
        this.showTitle = showTitle;
    }

    public Long getContestantId() {
        return contestantId;
    }

    public void setContestantId(Long contestantId) {
        this.contestantId = contestantId;
    }

    public String getContestantName() {
        return contestantName;
    }

    public void setContestantName(String contestantName) {
        this.contestantName = contestantName;
    }

    public LocalDateTime getVotedAt() {
        return votedAt;
    }

    public void setVotedAt(LocalDateTime votedAt) {
        this.votedAt = votedAt;
    }
}