package com.example.webrtc.controller;

import com.example.webrtc.dto.ChatRoom;
import com.example.webrtc.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * @Project : test_webrtc
 * @Date : 2020-05-08
 * @Author : nklee
 * @Description :
 */
@Controller
@RequestMapping("/chat")
public class ChatRoomController {

    private AtomicInteger seq = new AtomicInteger(0);

    @Autowired
    private ChatRoomRepository repository;

    @GetMapping("/rooms")
    public String rooms(Model model) {
        model.addAttribute("rooms", repository.getChatRooms());
        return "/chat/room-list";
    }

    @GetMapping("/rooms/{id}")
    public String room(@PathVariable String id, Model model) {
        ChatRoom room = repository.getChatRoom(id);
        model.addAttribute("room", room);
        model.addAttribute("member", "member" + seq.incrementAndGet());
        return "/chat/room";
    }
}