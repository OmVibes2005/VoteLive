package com.votelive.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "shows")
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private boolean votingActive;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Show() {
    }

    public Show(String title, String description) {
        this.title = title;
        this.description = description;
        this.votingActive = false;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isVotingActive() {
        return votingActive;
    }

    public void setVotingActive(boolean votingActive) {
        this.votingActive = votingActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}