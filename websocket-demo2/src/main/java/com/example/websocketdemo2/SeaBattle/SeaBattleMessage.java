package com.example.websocketdemo2.SeaBattle;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SeaBattleMessage {
    private int status;
    private String player1;
    private String player2;
    private int x;
    private int y;
    private int hitStatus; // 0 - error, 1 - don't hit, 2 - hit
    private int shipId;
    private boolean destroyedShip; //
    private String turn;
}
