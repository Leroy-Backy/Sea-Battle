package com.example.websocketdemo2.config;

import com.example.websocketdemo2.SeaBattle.SeaBattleWebSocketHandler;
import com.example.websocketdemo2.handler.ChatWebSocketHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.client.standard.WebSocketContainerFactoryBean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private static String chatEndpoint = "/chat";
    private static String seaBattleEndpoint = "/seabattle";

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry webSocketHandlerRegistry) {
        webSocketHandlerRegistry.addHandler(getChatWebSocketHandler(), chatEndpoint).setAllowedOriginPatterns("*");
        webSocketHandlerRegistry.addHandler(getSeaBattleWebSocketHandler(), seaBattleEndpoint).setAllowedOriginPatterns("*");
    }

    @Bean
    public WebSocketContainerFactoryBean getSocketContainer(){
        WebSocketContainerFactoryBean factoryBean = new WebSocketContainerFactoryBean();
        factoryBean.setMaxTextMessageBufferSize(2097152);
        factoryBean.setMaxBinaryMessageBufferSize(4194304);
        return factoryBean;
    }

    @Bean
    public WebSocketHandler getSeaBattleWebSocketHandler(){return new SeaBattleWebSocketHandler();}

    @Bean
    public WebSocketHandler getChatWebSocketHandler(){
        return new ChatWebSocketHandler();
    }
}
