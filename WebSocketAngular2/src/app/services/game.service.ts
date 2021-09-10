import { Injectable } from '@angular/core';
import {SeaBattleMessage} from "../models/SeaBattleMessage";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {SeaBattleGame} from "../models/SeaBattleGame";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  //@ts-ignore
  private url: string = window["cfgApiBaseUrl"] + "/seabattle"

  private apiUrl: string = "http://localhost:8080/api/seabattle";

  chatWebSocket!: WebSocket;
  seaBattleMessage: BehaviorSubject<SeaBattleMessage> = new BehaviorSubject<SeaBattleMessage>(new SeaBattleMessage());

  enemySeaBattleMessage: BehaviorSubject<SeaBattleMessage> = new BehaviorSubject<SeaBattleMessage>(new SeaBattleMessage());

  sessionClosed: BehaviorSubject<string> = new BehaviorSubject<string>("")

  nickname: BehaviorSubject<string> = new BehaviorSubject<string>("");

  mode: BehaviorSubject<number> = new BehaviorSubject<number>(-1)

  turn: BehaviorSubject<string> = new BehaviorSubject<string>("");

  enemy: BehaviorSubject<string> = new BehaviorSubject<string>("")

  constructor(private httpClient: HttpClient) { }

  public reloadService(){
    this.mode.next(-1)
    this.seaBattleMessage.next(new SeaBattleMessage())
    this.enemySeaBattleMessage.next(new SeaBattleMessage())

    this.enemy.next("")
    this.nickname.next("")
    this.turn.next("")
    this.sessionClosed.next("")
  }

  public getGames(): Observable<SeaBattleGame[]>{
    return this.httpClient.get<SeaBattleGame[]>(this.apiUrl)
  }

  public openWebSocket(){
    this.chatWebSocket = new WebSocket(this.url)

    this.chatWebSocket.onopen = (event) => {
      console.log("Open: " + event)
    };


    this.chatWebSocket.onmessage = (event) => {

      console.log(event.data)

      let seaBattleMessage: SeaBattleMessage = JSON.parse(event.data);

      if(seaBattleMessage.status == 5){
        this.enemySeaBattleMessage.next(seaBattleMessage);
      } else {
        this.seaBattleMessage.next(seaBattleMessage)
      }

    };

    this.chatWebSocket.onclose = (event) => {
      if(this.mode.value > -1)
        this.sessionClosed.next("Session was closed, maybe another player left the game")

      console.log("Close: " + event)
    };
  }

  public sendMessage(seaBattleMessage: SeaBattleMessage){
    //console.log(seaBattleMessage)
    this.chatWebSocket.send(JSON.stringify(seaBattleMessage))
  }

  public closeWebSocket(){
    this.chatWebSocket.close()
  }
}
