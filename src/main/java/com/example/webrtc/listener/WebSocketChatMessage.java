package com.example.webrtc.listener;

import lombok.Data;

/**
 * @Project : webrtc
 * @Date : 2020-05-29
 * @Author : nklee
 * @Description :
 */
@Data
public class WebSocketChatMessage {
    private String type;
    private String content;
    private String sender;
}
