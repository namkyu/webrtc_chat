package com.example.webrtc.dto;

import lombok.Data;

import java.util.List;

/**
 * @Project : test_webrtc
 * @Date : 2020-05-08
 * @Author : nklee
 * @Description :
 */
@Data
public class Message {

    private String event;
    private String name;
    private List<User> users;
}
