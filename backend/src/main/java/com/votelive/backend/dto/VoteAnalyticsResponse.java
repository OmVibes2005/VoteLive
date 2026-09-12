package com.votelive.backend.dto;

public class VoteAnalyticsResponse {

    private Long totalVotes;
    private Long leadingContestantId;
    private String leadingContestantName;
    private Long leadingVoteCount;
    private Double leadingPercentage;

    public VoteAnalyticsResponse() {
    }

    public VoteAnalyticsResponse(
            Long totalVotes,
            Long leadingContestantId,
            String leadingContestantName,
            Long leadingVoteCount,
            Double leadingPercentage
    ) {
        this.totalVotes = totalVotes;
        this.leadingContestantId = leadingContestantId;
        this.leadingContestantName = leadingContestantName;
        this.leadingVoteCount = leadingVoteCount;
        this.leadingPercentage = leadingPercentage;
    }

    public Long getTotalVotes() {
        return totalVotes;
    }

    public void setTotalVotes(Long totalVotes) {
        this.totalVotes = totalVotes;
    }

    public Long getLeadingContestantId() {
        return leadingContestantId;
    }

    public void setLeadingContestantId(Long leadingContestantId) {
        this.leadingContestantId = leadingContestantId;
    }

    public String getLeadingContestantName() {
        return leadingContestantName;
    }

    public void setLeadingContestantName(String leadingContestantName) {
        this.leadingContestantName = leadingContestantName;
    }

    public Long getLeadingVoteCount() {
        return leadingVoteCount;
    }

    public void setLeadingVoteCount(Long leadingVoteCount) {
        this.leadingVoteCount = leadingVoteCount;
    }

    public Double getLeadingPercentage() {
        return leadingPercentage;
    }

    public void setLeadingPercentage(Double leadingPercentage) {
        this.leadingPercentage = leadingPercentage;
    }
}