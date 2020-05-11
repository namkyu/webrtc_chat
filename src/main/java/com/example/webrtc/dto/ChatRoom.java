package com.example.webrtc.dto;

import lombok.Data;
import lombok.NonNull;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * @Project : test_webrtc
 * @Date : 2020-05-08
 * @Author : nklee
 * @Description :
 */
@Data
public class ChatRoom {
    private String id;
    private String name;
    private Set<WebSocketSession> sessions = new HashSet<>();

    // 채팅방 생성
    public static ChatRoom create(@NonNull String name) {
        ChatRoom created = new ChatRoom();
        created.id = UUID.randomUUID().toString();
        created.name = name;
        return created;
    }
}
