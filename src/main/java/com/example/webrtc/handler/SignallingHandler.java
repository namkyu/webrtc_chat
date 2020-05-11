package com.example.webrtc.handler;

import com.example.webrtc.common.constant.EventType;
import com.example.webrtc.dto.Message;
import com.example.webrtc.dto.User;
import com.example.webrtc.service.SignallingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.InetSocketAddress;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @Project : test_webrtc
 * @Date : 2020-04-27
 * @Author : nklee
 * @Description :
 */
@Slf4j
@Component
public class SignallingHandler extends TextWebSocketHandler {

    private List<User> users = new CopyOnWriteArrayList<>();
    private final AtomicInteger seq = new AtomicInteger(0);


    private ObjectMapper objectMapper;
    private SignallingService signallingService;

    public SignallingHandler(ObjectMapper objectMapper, SignallingService signallingService) {
        this.objectMapper = objectMapper;
        this.signallingService = signallingService;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        Message msgInfo = objectMapper.readValue(payload, Message.class);
        String event = msgInfo.getEvent();

        // 방 입장
        if (EventType.JOIN.getName().equals(event)) {
            signallingService.join(users, session, msgInfo);
        }
        // 접속 제안
        else if (EventType.OFFER.getName().equals(event)) {
            signallingService.sendMsg(users, session, message);
        }
        // 접속 수락
        else if (EventType.ANSWER.getName().equals(event)) {
            signallingService.sendMsg(users, session, message);
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        User user = new User();
        user.setSession(session);
        user.setSessionId(session.getId());
        user.setUserName("User" + seq.incrementAndGet());
        user.setRemoteAddress(session.getRemoteAddress());
        user.setTextMessageSizeLimit(session.getTextMessageSizeLimit());
        users.add(user);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        users.removeIf(user -> user.getSession().equals(session));
    }
}