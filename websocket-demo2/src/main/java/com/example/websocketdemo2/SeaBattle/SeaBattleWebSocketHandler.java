package com.example.websocketdemo2.SeaBattle;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

public class SeaBattleWebSocketHandler extends TextWebSocketHandler {
    private final List<SeaBattleGame> webSocketBattlesSession = new LinkedList<>();

    @Autowired
    private SeaBattleService seaBattleService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        webSocketBattlesSession.add(new SeaBattleGame(
                session, GameStatus.ERROR
        ));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        SeaBattleMessage seaBattleMessage = objectMapper.readValue(message.getPayload(), SeaBattleMessage.class);

        System.out.println("Message: " + seaBattleMessage);

        if(seaBattleMessage.getStatus() == 1){
            SeaBattleGame game = webSocketBattlesSession.stream().filter(w -> w.getSession1().equals(session)).findFirst().get();
            game.setStatus(GameStatus.CREATED);
            game.setPlayer1(seaBattleMessage.getPlayer1());

            seaBattleService.addCreatedGame(game);

            for(SeaBattleGame seaBattleGame: webSocketBattlesSession){
                seaBattleGame.getSession1().sendMessage(message);
            }
            System.out.println("GameStatusCreated: " + game);

        } else if(seaBattleMessage.getStatus() == 2){

            Optional<SeaBattleGame> gameOptional = webSocketBattlesSession.stream().filter(w -> w.getStatus().equals(GameStatus.CREATED) && w.getPlayer1().equals(seaBattleMessage.getPlayer1())).findFirst();

            if(gameOptional.isEmpty()){
                return;
            }

            SeaBattleGame game = gameOptional.get();

            if(game.getPlayer2() != null) {

                TextMessage textMessage = new TextMessage("{\"status\":-1}");

                session.sendMessage(textMessage);

                return;
            }


            TextMessage textMessageDelete = new TextMessage("{\"status\":0,\"player1\":\"" + game.getPlayer1() + "\"}");

            seaBattleService.deleteCreatedGame(game.getPlayer1());

            for(SeaBattleGame seaBattleGame: webSocketBattlesSession){
                if(seaBattleGame.getStatus().equals(GameStatus.ERROR))
                    seaBattleGame.getSession1().sendMessage(textMessageDelete);
            }

            game.setStatus(GameStatus.CONNECTED);
            game.setPlayer2(seaBattleMessage.getPlayer2());
            game.setSession2(session);

            game.getSession1().sendMessage(message);

            Random random = new Random();
            int turn = random.nextInt(2);
            String playerTurn;
            if(turn == 0){
                playerTurn = game.getPlayer1();
                game.setTurn(game.getPlayer1());
            } else {
                playerTurn = game.getPlayer2();
                game.setTurn(game.getPlayer2());
            }

            TextMessage textMessage = new TextMessage("{\"status\":2.5,\"turn\":\"" + playerTurn + "\"}");

            game.getSession1().sendMessage(textMessage);
            game.getSession2().sendMessage(textMessage);

            webSocketBattlesSession.remove(webSocketBattlesSession.stream().filter(w -> w.getSession1().equals(session)).findFirst().get());

            System.out.println("GameStatusConnected: " + game);
        } else if (seaBattleMessage.getStatus() == 3){
            Optional<SeaBattleGame> gameOptional = webSocketBattlesSession.stream().filter(w -> w.getSession1().equals(session) || w.getSession2().equals(session)).findFirst();
            if(gameOptional.isEmpty()) return;

            SeaBattleGame game = gameOptional.get();

            if(game.getPlayer2() == null){
                TextMessage textMessage = new TextMessage("{\"status\":-1}");

                session.sendMessage(textMessage);

                return;
            }

            if(game.getSession1().equals(session)){
                game.getSession2().sendMessage(message);
            } else {
                game.getSession1().sendMessage(message);
            }

        } else if (seaBattleMessage.getStatus() == 4){
            Optional<SeaBattleGame> gameOptional = webSocketBattlesSession.stream().filter(w -> w.getSession1().equals(session) || w.getSession2().equals(session)).findFirst();
            if(gameOptional.isEmpty()) return;

            System.out.println(webSocketBattlesSession);

            SeaBattleGame game = gameOptional.get();

            if(game.getSession1().equals(session)){
                if(!game.getTurn().equals(game.getPlayer1())) return;

                game.getSession2().sendMessage(message);
            } else {
                if(!game.getTurn().equals(game.getPlayer2())) return;

                game.getSession1().sendMessage(message);
            }
        } else if(seaBattleMessage.getStatus() == 5){
            Optional<SeaBattleGame> gameOptional = webSocketBattlesSession.stream().filter(w -> w.getSession1().equals(session) || w.getSession2().equals(session)).findFirst();
            if(gameOptional.isEmpty()) return;

            SeaBattleGame game = gameOptional.get();

            if(seaBattleMessage.getHitStatus() == 1){
                if(game.getTurn().equals(game.getPlayer1()))
                    game.setTurn(game.getPlayer2());
                else
                    game.setTurn(game.getPlayer1());
            }

            if(game.getSession1().equals(session)){
                game.getSession2().sendMessage(message);
            } else {
                game.getSession1().sendMessage(message);
            }
        } else if(seaBattleMessage.getStatus() == 6){

            Optional<SeaBattleGame> gameOptional = webSocketBattlesSession.stream().filter(w -> w.getSession1().equals(session) || w.getSession2().equals(session)).findFirst();
            if(gameOptional.isEmpty()) return;

            SeaBattleGame game = gameOptional.get();

            if(game.getSession1().equals(session)){
                game.getSession2().sendMessage(message);
            } else {
                game.getSession1().sendMessage(message);
            }
        }


    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        if(webSocketBattlesSession.size() > 0){

            Optional<SeaBattleGame> gameOptional1 = webSocketBattlesSession.stream().filter(w -> w.getSession1().equals(session)).findFirst();

            if(gameOptional1.isPresent()){

                if(gameOptional1.get().getSession2() != null)
                    gameOptional1.get().getSession2().close();

                if(gameOptional1.get().getStatus().equals(GameStatus.CREATED)){
                    TextMessage textMessageDelete = new TextMessage("{\"status\":0,\"player1\":\"" + gameOptional1.get().getPlayer1() + "\"}");

                    seaBattleService.deleteCreatedGame(gameOptional1.get().getPlayer1());

                    for(SeaBattleGame seaBattleGame: webSocketBattlesSession){
                        if(seaBattleGame.getStatus().equals(GameStatus.ERROR))
                            seaBattleGame.getSession1().sendMessage(textMessageDelete);
                    }
                }

                webSocketBattlesSession.remove(gameOptional1.get());
            } else {
                Optional<SeaBattleGame> gameOptional2 = webSocketBattlesSession.stream().filter(w -> w.getSession2() != null && w.getSession2().equals(session)).findFirst();
                if(gameOptional2.isPresent()){
                    if(gameOptional2.get().getSession1() != null)
                        gameOptional2.get().getSession1().close();

                    webSocketBattlesSession.remove(gameOptional2.get());
                }
            }

            System.out.println("Closed");
        }
    }
}
