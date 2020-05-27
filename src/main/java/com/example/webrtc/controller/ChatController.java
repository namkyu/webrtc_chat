package com.example.webrtc.controller;

import com.example.webrtc.dto.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

/**
 * @Project : webrtc
 * @Date : 2020-05-27
 * @Author : nklee
 * @Description :
 */
@RequiredArgsConstructor
@Controller
public class ChatController {

    private final SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/chat/message")
    public void message(ChatMessage message) {
        if (ChatMessage.MessageType.ENTER.equals(message.getType())) {
            message.setMessage(message.getSender() + "님이 입장하셨습니다.");
        }

        messagingTemplate.convertAndSend("/sub/chat/room/" + message.getRoomId(), message);
    }
}
