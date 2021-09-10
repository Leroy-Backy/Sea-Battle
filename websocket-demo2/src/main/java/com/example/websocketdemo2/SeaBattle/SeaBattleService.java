package com.example.websocketdemo2.SeaBattle;

import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SeaBattleService {
    private final List<SeaBattleGame> webSocketBattlesSession = new LinkedList<>();

    public List<SeaBattleGameDto> getCreatedGames(){
        return webSocketBattlesSession.stream().map(SeaBattleGameDto::new).collect(Collectors.toList());
    }

    public void addCreatedGame(SeaBattleGame game){
        webSocketBattlesSession.add(game);
    }

    public void deleteCreatedGame(String player1){
        Optional<SeaBattleGame> gameOptional = webSocketBattlesSession.stream().filter(g -> g.getPlayer1().equals(player1)).findFirst();

        if(gameOptional.isPresent()){
            webSocketBattlesSession.remove(gameOptional.get());
        }
    }
}
