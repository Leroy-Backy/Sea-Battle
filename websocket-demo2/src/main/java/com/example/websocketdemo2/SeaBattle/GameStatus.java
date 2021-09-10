package com.example.websocketdemo2.SeaBattle;

public enum GameStatus {
    ERROR, CREATED, CONNECTED, READY, END;

    public static GameStatus getStatus(int num){
        switch (num){
            case 1: return CREATED;
            case 2: return CONNECTED;
            case 3: return READY;
            case 4: return END;
            default: return ERROR;
        }
    }
}
