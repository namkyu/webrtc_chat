package com.example.webrtc.service;

import com.example.webrtc.dto.Message;
import com.example.webrtc.dto.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.List;

/**
 * @Project : test_webrtc
 * @Date : 2020-05-08
 * @Author : nklee
 * @Description :
 */
@Slf4j
@Service
public class SignallingService {

    @Autowired
    private ObjectMapper objectMapper;

    public void join(List<User> users, WebSocketSession session, Message message) throws JsonProcessingException {
        if (users.size() > 0) {
            message.setUsers(users);
            TextMessage textMessage = new TextMessage(objectMapper.writeValueAsString(message));
            users.parallelStream().forEach(user -> sendMessage(user.getSession(), textMessage));
        }
    }

    public void sendMsg(List<User> sessions, WebSocketSession session, TextMessage message) {
        for (User user : sessions) {
            WebSocketSession webSocketSession = user.getSession();
            if (webSocketSession.isOpen() && session.getId().equals(webSocketSession.getId()) == false) {
                sendMessage(webSocketSession, message);
            }
        }
    }

    private void sendMessage(WebSocketSession webSocketSession, TextMessage textMessage) {
        try {
            webSocketSession.sendMessage(textMessage);
        } catch (IOException e) {
            log.error("##ERROR", e);
            throw new RuntimeException(e);
        }
    }
}
