package com.example.webrtc.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.web.socket.WebSocketSession;

import java.net.InetSocketAddress;

/**
 * @Project : test_webrtc
 * @Date : 2020-05-11
 * @Author : nklee
 * @Description :
 */
@Data
public class User {
    @JsonIgnore
    private WebSocketSession session;
    private String sessionId;
    private String userName;
    private InetSocketAddress remoteAddress;
    private int textMessageSizeLimit;
}
