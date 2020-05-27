package com.example.webrtc.dto;

import lombok.Data;

import java.util.UUID;

/**
 * @Project : webrtc
 * @Date : 2020-05-27
 * @Author : nklee
 * @Description :
 */
@Data
public class ChatRoom {

    private String roomId;
    private String name;

    public static ChatRoom create(String name) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.roomId = UUID.randomUUID().toString();
        chatRoom.name = name;
        return chatRoom;
    }
}
