package com.example.webrtc.controller;

import com.example.webrtc.dto.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

/**
 * @Project : webrtc
 * @Date : 2020-05-27
 * @Author : nklee
 * @Description :
 */
@Controller
public class ChatController {

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    // payload='/greetings/1' is not a valid topic destination
    // RabbitMQ does not support "/" as a separator
    @MessageMapping("/chat.message")
    public void message(ChatMessage message) {
        if (ChatMessage.MessageType.ENTER.equals(message.getType())) {
            message.setMessage(message.getSender() + "님이 입장하셨습니다.");
        }

        messagingTemplate.convertAndSend("/topic/chat.room." + message.getRoomId(), message);
    }
}
