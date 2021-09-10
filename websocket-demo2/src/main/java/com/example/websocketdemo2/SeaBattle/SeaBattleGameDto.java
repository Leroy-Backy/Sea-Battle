package com.example.websocketdemo2.SeaBattle;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SeaBattleGameDto {
    private String player1;

    public SeaBattleGameDto(SeaBattleGame seaBattleGame){
        this.player1 = seaBattleGame.getPlayer1();
    }
}
