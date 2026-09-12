package com.votelive.backend.dto;

public class VoteResultResponse {

    private int rank;
    private Long contestantId;
    private String contestantName;
    private Long voteCount;
    private double votePercentage;
    private boolean leading;

    public VoteResultResponse() {
    }

    public VoteResultResponse(
            int rank,
            Long contestantId,
            String contestantName,
            Long voteCount,
            double votePercentage,
            boolean leading) {

        this.rank = rank;
        this.contestantId = contestantId;
        this.contestantName = contestantName;
        this.voteCount = voteCount;
        this.votePercentage = votePercentage;
        this.leading = leading;
    }

    public int getRank() {
        return rank;
    }

    public Long getContestantId() {
        return contestantId;
    }

    public String getContestantName() {
        return contestantName;
    }

    public Long getVoteCount() {
        return voteCount;
    }

    public double getVotePercentage() {
        return votePercentage;
    }

    public boolean isLeading() {
        return leading;
    }
}