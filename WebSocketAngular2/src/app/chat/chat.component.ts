import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {WebSocketService} from "../services/web-socket.service";
import {ChatMessage} from "../models/ChatMessage";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  constructor(public webSocketService: WebSocketService) { }

  image!: string;

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
  }

  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();
  }

  sendMessage(sendForm: NgForm){
    let chatMessage: ChatMessage = new ChatMessage(sendForm.value.user, sendForm.value.message);

    if(this.image != null)
      chatMessage.image = this.image;

    this.webSocketService.sendMessage(chatMessage);

    sendForm.control.controls["message"].reset();
    //@ts-ignore
    this.image = null
  }


  setImage(event: Event) {
    if((<HTMLInputElement>event.target).files![0] != null) {
      let image = (<HTMLInputElement>event.target).files![0];

      //@ts-ignore
      (<HTMLInputElement>event.target).value = null;

      const reader = new FileReader();
      reader.readAsDataURL(image);

      reader.onload = () => {
        // @ts-ignore
        this.image = reader.result;
      }
    }
  }
}
