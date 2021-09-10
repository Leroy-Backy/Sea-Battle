import {Component, OnDestroy, OnInit} from '@angular/core';
import {SeaBattleMessage} from "../models/SeaBattleMessage";
import {GameService} from "../services/game.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {SeaBattleGame} from "../models/SeaBattleGame";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {

  constructor(private gameService: GameService,
              private router: Router) { }

  nickname!: string;

  seaBattleMessages: SeaBattleMessage[] = []

  ngOnInit(): void {
    this.gameService.openWebSocket();

    this.gameService.getGames().subscribe(data => {
      for(let game of data){
        let msg = new SeaBattleMessage()
        msg.player1 = game.player1

        this.seaBattleMessages.push(msg)
      }
    })

    this.gameService.seaBattleMessage.subscribe(data => {
      if(data.status == 1){
        this.seaBattleMessages.push(data)
      } else if(data.status == 0){
        let idx = this.seaBattleMessages.findIndex((msg) => {msg.player1 == data.player1});

        this.seaBattleMessages.splice(idx, 1);
      }

    })
  }


  createGame(){
    if(this.nickname != null){
      this.gameService.nickname.next(this.nickname)

      this.router.navigateByUrl("game/create")
    }
  }

  connectToGame(player1: string){
    if(this.nickname != null){
      this.gameService.nickname.next(this.nickname)

      this.router.navigateByUrl("game/" + player1);
    }
  }

  ngOnDestroy() {
    this.gameService.closeWebSocket();
  }

  setNickname(form: NgForm) {
    if(form.value.nickname != null){
      this.nickname = form.value.nickname;
    }
  }
}
