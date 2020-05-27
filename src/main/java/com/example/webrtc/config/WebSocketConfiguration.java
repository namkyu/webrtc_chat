package com.example.webrtc.config;

import com.example.webrtc.handler.SignallingHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;


/**
 * @Project : test_webrtc
 * @Date : 2020-04-27
 * @Author : nklee
 * @Description :
 */
@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

    @Autowired
    private SignallingHandler signallingHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(signallingHandler, "/socket").setAllowedOrigins("*");
    }
}
