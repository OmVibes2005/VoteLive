package com.votelive.backend.dto;

import java.time.LocalDateTime;

public class AdminVoteResponse {

    private Long voteId;

    private Long userId;
    private String userName;
    private String userEmail;

    private Long showId;
    private String showTitle;

    private Long contestantId;
    private String contestantName;

    private LocalDateTime votedAt;

    public AdminVoteResponse() {
    }

    public AdminVoteResponse(
            Long voteId,
            Long userId,
            String userName,
            String userEmail,
            Long showId,
            String showTitle,
            Long contestantId,
            String contestantName,
            LocalDateTime votedAt) {

        this.voteId = voteId;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
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