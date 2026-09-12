package com.votelive.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "votes",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_show",
                        columnNames = {"user_id", "show_id"}
                )
        }
)
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "contestant_id", nullable = false)
    private Contestant contestant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @Column(nullable = false)
    private LocalDateTime votedAt;

    public Vote() {
    }

    public Vote(User user, Contestant contestant, Show show) {
        this.user = user;
        this.contestant = contestant;
        this.show = show;
        this.votedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (votedAt == null) {
            votedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Contestant getContestant() {
        return contestant;
    }

    public void setContestant(Contestant contestant) {
        this.contestant = contestant;
    }

    public Show getShow() {
        return show;
    }

    public void setShow(Show show) {
        this.show = show;
    }

    public LocalDateTime getVotedAt() {
        return votedAt;
    }
}