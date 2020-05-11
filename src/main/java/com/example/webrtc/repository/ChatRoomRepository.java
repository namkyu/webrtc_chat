package com.example.webrtc.repository;

import com.example.webrtc.dto.ChatRoom;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @Project : test_webrtc
 * @Date : 2020-05-08
 * @Author : nklee
 * @Description :
 */
@Repository
public class ChatRoomRepository {
    private final Map<String, ChatRoom> chatRoomMap;

    public ChatRoomRepository() {
        chatRoomMap = Collections.unmodifiableMap(
                Stream.of(ChatRoom.create("1번방"), ChatRoom.create("2번방"), ChatRoom.create("3번방"))
                        .collect(Collectors.toMap(ChatRoom::getId, Function.identity())));
    }

    public ChatRoom getChatRoom(String id) {
        return chatRoomMap.get(id);
    }

    public Collection<ChatRoom> getChatRooms() {
        return chatRoomMap.values();
    }

}
