package com.example.websocketdemo2.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

public class ChatMessage {
    private String user;
    private String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String image;

    public ChatMessage(){}

    public ChatMessage(String user, String message, String image) {
        this.user = user;
        this.message = message;
        this.image = image;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "user='" + user + '\'' +
                ", message='" + message + '\'' +
                ", image='" + image + '\'' +
                '}';
    }
}
