package com.votelive.backend.service;

import com.votelive.backend.dto.VoteResultResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoteResultPublisher {

    private final SimpMessagingTemplate messagingTemplate;
    private final VoteResultService voteResultService;

    public VoteResultPublisher(
            SimpMessagingTemplate messagingTemplate,
            VoteResultService voteResultService) {

        this.messagingTemplate = messagingTemplate;
        this.voteResultService = voteResultService;
    }

    public void publishResults(Long showId) {

        List<VoteResultResponse> results =
                voteResultService.getResultsByShow(showId);

        messagingTemplate.convertAndSend(
                "/topic/show/" + showId + "/results",
                results
        );
    }
}