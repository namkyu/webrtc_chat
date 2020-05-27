package com.example.webrtc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * @Project : webrtc
 * @Date : 2020-05-27
 * @Author : nklee
 * @Description :
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketBrokerConfiguration implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 메시지 브로커가 /sub 를 구독하는 구독자들에게 메시지를 전달해 줌
        config.enableSimpleBroker("/sub");
        // 클라이언트가 서버에게 /pub 을 붙이고 메시지를 전달할 주소
        config.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 클라이언트가 서버에 접속할 Endpoint 를 설정한다. (여러 개 추가 가능)
        // 클라이언트가 WebSocket 대신 향상된 SockJS로 접속하려면 .withSockJS 붙여준다.
        registry.addEndpoint("/ws-stomp").setAllowedOrigins("*").withSockJS();
    }
}
