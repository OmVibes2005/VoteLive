package com.votelive.backend.dto;

public class ContestantResponse {

    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Long showId;

    public ContestantResponse() {
    }

    public ContestantResponse(
            Long id,
            String name,
            String description,
            String imageUrl,
            Long showId) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.showId = showId;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Long getShowId() {
        return showId;
    }
}