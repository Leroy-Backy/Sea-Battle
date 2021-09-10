import { Injectable } from '@angular/core';
import {ChatMessage} from "../models/ChatMessage";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  webSocket!: WebSocket;
  chatMessages: ChatMessage[] = [];

  //@ts-ignore
  private url: string = window["cfgApiBaseUrl"] + "/chat";

  constructor() { }

  public openWebSocket(){
    this.webSocket = new WebSocket(this.url)

    this.webSocket.onopen = (event) => {
      console.log("Open: ", event)
    };

    this.webSocket.onmessage = (event) => {
      const chatMessage = JSON.parse(event.data);

      this.chatMessages.push(chatMessage);
    };

    this.webSocket.onclose = (event) => {
      console.log("Close: ", event)
    };
  }

  public sendMessage(chatMessage: ChatMessage){
    this.webSocket.send(JSON.stringify(chatMessage));
  }

  public closeWebSocket(){
    this.webSocket.close();
  }
}
