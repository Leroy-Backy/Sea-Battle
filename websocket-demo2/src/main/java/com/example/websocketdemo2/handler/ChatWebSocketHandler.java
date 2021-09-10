package com.example.websocketdemo2.handler;

import com.example.websocketdemo2.entity.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.HtmlUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final List<WebSocketSession> webSocketSessions = new ArrayList<>();

    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass().getName());

    private String json = "";
    private int bytes = 0;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        webSocketSessions.add(session);
        LOGGER.info("Connected: " + session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        if(!message.isLast()){
            json += message.getPayload();
            bytes += message.getPayloadLength();
        } else {
            json += message.getPayload();
            bytes += message.getPayloadLength();

            ObjectMapper objectMapper = new ObjectMapper();



            ChatMessage chatMessage = objectMapper.readValue(json, ChatMessage.class);

//            int substring = 23;
//            System.out.println(chatMessage.getImage().charAt(11));
//            if(chatMessage.getImage().charAt(11) == 'p')
//                substring = 22;
//
//            byte[] bytesImage = Base64.getDecoder().decode(chatMessage.getImage().substring(substring));

            System.out.println("\n=====\nBytes: " + bytes);

            json = "";
            bytes = 0;
        }

        for(WebSocketSession webSocketSession: webSocketSessions){
            webSocketSession.sendMessage(message);
        }
    }

    @Override
    public boolean supportsPartialMessages() {
        return true;
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        webSocketSessions.remove(session);
        LOGGER.info("Disconnected: " + session);
    }
}
