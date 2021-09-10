package com.example.websocketdemo2.SeaBattle;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.socket.WebSocketSession;

@Getter
@Setter
@ToString
public class SeaBattleGame {
    private WebSocketSession session1;
    private WebSocketSession session2;
    private String player1;
    private String player2;
    private GameStatus status;
    private String turn;

    public SeaBattleGame(){}


    public SeaBattleGame(WebSocketSession session, GameStatus status) {
        this.session1 = session;
        this.status = status;
    }
}
