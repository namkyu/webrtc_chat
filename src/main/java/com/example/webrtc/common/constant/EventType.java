package com.example.webrtc.common.constant;

import lombok.Getter;

public enum EventType {

    OFFER("offer")
    , ANSWER("answer")
    , JOIN("join")
    , CANDIDATE("candidate")
    ;

    @Getter
    private String name;

    EventType(String name) {
        this.name = name;
    }
}