import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Cell} from "../models/cell";
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../services/game.service";
import {SeaBattleMessage} from "../models/SeaBattleMessage";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private route: ActivatedRoute,
              private gameService: GameService,
              private router: Router) {
  }

  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;

  nickname!: string;
  enemy!: string;

  player1!: string;
  player2!: string;
  iAmReady: boolean = false;
  enemyReady: boolean = false;

  turn!: string;

  winner!: string;

  mode: number = 0;

  writing: string = "Welcome to Sea Battle!"

  shipBoards: number[] = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
  shipBoardsIdx: number = 0;

  shipsIds: number[] = [];

  currShipX: number[] = []
  currShipY: number[] = []

  cells: Cell[][] = []

  ngOnInit(): void {

    this.gameService.openWebSocket()
    this.gameService.seaBattleMessage.subscribe(data => {

      // connection failed
      if(data.status == -1){
        console.log(data)
        this.router.navigateByUrl("lobby")

      } else if(data.status == 2){
        this.player2 = data.player2;
        this.enemy = data.player2

      } else if(data.status == 2.5){
        this.gameService.turn.next(data.turn);

      } else if(data.status == 3){
        this.enemyReady = true;

        if(this.iAmReady) {
          this.mode = 4;
          this.cleanMyBoard();
          this.gameService.mode.next(4)
          this.gameService.enemy.next(this.enemy)
        }
      } else if(data.status == 4){
        this.enemyShoot(data.x, data.y)

      } else if(data.status == 6){
        this.winner = this.nickname;

        this.mode = 5;
        this.gameService.mode.next(5)

        this.gameService.mode.next(5)
      }


    })

    this.gameService.turn.subscribe(data => {this.turn = data})

    this.gameService.sessionClosed.subscribe(data => {
      if(data !== ""){
        if (confirm(data))
          this.router.navigateByUrl("/lobby")
        else
          this.router.navigateByUrl("/lobby")
      }


    })

    this.route.paramMap.subscribe(() => {
      // @ts-ignore
      let param = this.route.snapshot.paramMap.get("user")

      if(param == "create"){
        this.gameService.nickname.subscribe(data => {
          this.nickname = data;
          this.player1 = data
        }).unsubscribe()

        setTimeout(() => {
          this.createGame()
        }, 1000)


      } else {
        //@ts-ignore
        this.player1 = param
        //@ts-ignore
        this.enemy = param

        this.gameService.nickname.subscribe(data => {
          this.nickname = data;
          this.player2 = data
        }).unsubscribe()

        setTimeout(() => {
          this.connectToGame()
        }, 1000)
      }

    })

    for(let y = 0; y < 10; y++){
      let tempCells: Cell[] = []

      for(let x = 0; x < 10; x++){
        let color: string = Cell.color_water

        let cell = new Cell(x, y, color)

        tempCells.push(cell)
      }

      this.cells.push(tempCells)
    }
  }

  enemyShoot(x: number, y: number){
    if(this.cells[y][x].shipId >= 0){
      this.cells[y][x].filled = true;
      this.cells[y][x].color = Cell.color_hit

      let idx = this.shipsIds.indexOf(this.cells[y][x].shipId);

      this.shipsIds.splice(idx, 1);

      let destroyed: boolean = false;

      if(this.shipsIds.indexOf(this.cells[y][x].shipId) < 0) {
        destroyed = true;

        let xArr: number[] = [];
        let yArr: number[] = [];

        for(let j = 0; j < 10; j++){
          for(let i = 0; i < 10; i++){
            if(this.cells[j][i].shipId == this.cells[y][x].shipId){
              xArr.push(i);
              yArr.push(j);
            }
          }
        }

        xArr.sort((a, b) => {return a - b})
        yArr.sort((a, b) => {return a - b})

        let y_min = yArr[0] - 1;
        let y_max = yArr[yArr.length-1] + 1;
        let x_min = xArr[0] - 1;
        let x_max = xArr[xArr.length-1] + 1;
        if(y_min < 0) y_min = 0;
        if(y_max > 9) y_max = 9;
        if(x_min < 0) x_min = 0;
        if(x_max > 9) x_max = 9;

        for(let g = y_min; g <= y_max; g++){
          for(let h = x_min; h <= x_max; h++){
            this.cells[g][h].filled = true;
            this.cells[g][h].color = Cell.color_fail
          }
        }

        for(let i = 0; i < xArr.length; i++){
          this.cells[yArr[i]][xArr[i]].color = Cell.color_hit;
        }

      }


      this.drawBoard()

      if(this.shipsIds.length <= 0){
        let message: SeaBattleMessage = new SeaBattleMessage();
        message.status = 6;

        this.mode = 5;
        this.gameService.mode.next(5)

        this.winner = this.enemy;

        this.gameService.sendMessage(message)


      }

      let message: SeaBattleMessage = new SeaBattleMessage();

      message.status = 5;
      message.x = x;
      message.y = y;
      message.shipId = this.cells[y][x].shipId;
      message.turn = this.enemy;
      message.destroyedShip = destroyed;
      message.hitStatus = 2;

      this.gameService.turn.next(this.enemy);

      this.gameService.sendMessage(message);

    } else {
      this.cells[y][x].filled = true;
      this.cells[y][x].color  = Cell.color_fail;
      this.drawBoard()

      let message: SeaBattleMessage = new SeaBattleMessage();

      message.status = 5;
      message.x = x;
      message.y = y;
      message.hitStatus = 1;
      message.turn = this.nickname

      this.gameService.turn.next(this.nickname);

      this.gameService.sendMessage(message);

    }
  }

  createGame(){
    this.gameService.mode.next(0)

    let message: SeaBattleMessage = new SeaBattleMessage();
    message.status = 1;
    message.player1 = this.player1

    this.gameService.sendMessage(message)
  }

  connectToGame(){
    this.gameService.mode.next(0)

    let message: SeaBattleMessage = new SeaBattleMessage();
    message.status = 2;
    message.player1 = this.player1;
    message.player2 = this.player2;

    this.gameService.sendMessage(message)
  }

  ngAfterViewInit(): void {
    this.canvas = <HTMLCanvasElement> document.getElementById("myCanvas")
    this.context = <CanvasRenderingContext2D> this.canvas.getContext("2d")

    this.drawBoard()

    this.canvas.addEventListener("click", (event) => {
      if(this.mode < 1) return;

      this.insertShips((event.pageX - this.canvas.offsetLeft)/40 | 0, (event.pageY - this.canvas.offsetTop)/40 | 0)

      //console.log((event.pageX - this.canvas.offsetLeft)/40 | 0, (event.pageY - this.canvas.offsetTop)/40 | 0)
    }, false)

  }

  insertShips(x: number, y: number){
    if(this.shipBoardsIdx == 9) {
      //this.writing = "You placed all ships"
      this.mode = 2;
    }
    if(this.shipBoardsIdx > 9) {
      return;
    }

    if(this.cells[y][x].filled) return;

    this.currShipX.push(x)
    this.currShipY.push(y)

    this.colorCell(Cell.color_ship, x, y)


    if(this.currShipX.length == this.shipBoards[this.shipBoardsIdx]){
      this.analyseShip()
    }

  }

  analyseShip(){

    if(this.shipBoards[this.shipBoardsIdx] == 1){
      this.placeShip()
      if(this.shipBoardsIdx == 10) this.writing = "You placed all ships"
    }

    if(!((this.checkArr(this.currShipX) == 0 && this.checkArr(this.currShipY) == 1) ||
      (this.checkArr(this.currShipY) == 0 && this.checkArr(this.currShipX) == 1))){

      this.clean()
    } else {

      this.placeShip()
    }

  }

  placeShip(){
    let y_min = this.currShipY[0] - 1;
    let y_max = this.currShipY[this.currShipY.length-1] + 1;
    let x_min = this.currShipX[0] - 1;
    let x_max = this.currShipX[this.currShipX.length-1] + 1;
    if(y_min < 0) y_min = 0;
    if(y_max > 9) y_max = 9;
    if(x_min < 0) x_min = 0;
    if(x_max > 9) x_max = 9;

    for(let g = y_min; g <= y_max; g++){
      for(let h = x_min; h <= x_max; h++){
        this.cells[g][h].filled = true;
        this.cells[g][h].color = Cell.color_filled;
      }
    }

    for(let i = 0; i < this.currShipX.length; i++){
      let x = this.currShipX[i];
      let y = this.currShipY[i];

      this.cells[y][x].color = Cell.color_ship;
      this.cells[y][x].shipId = this.shipBoardsIdx

      this.shipsIds.push(this.shipBoardsIdx)
    }

    this.writing = "Place ship with " + this.shipBoards[++this.shipBoardsIdx] + " boards"

    this.clean()
  }

  clean(){
    this.currShipX.length = 0
    this.currShipY.length = 0
    this.drawBoard()
  }

  checkArr(array: number[]): number{
    array.sort((a, b) => {return a - b})

    let equal: boolean = true;
    let growth: boolean = true;

    for(let i = 0; i < array.length - 1; i++){
      if(array[i] != array[i+1]) equal = false;
      if(array[i+1] - array[i] != 1) growth = false;
    }

    if(equal == true){
      return 0;                    // if 0, then array has same numbers
    } else if(growth == true){
      return 1;                    // if 1, then numbers in array increments by 1
    } else {
      return 2;                    // if 2, then numbers in array are random
    }
  }

  cleanMyBoard(){
    for(let y = 0; y < 10; y++){
      for(let x = 0; x < 10; x++){
        if(this.cells[y][x].shipId < 0){
          this.cells[y][x].filled = false;
          this.cells[y][x].color = Cell.color_water;
        }
      }
    }

    this.drawBoard()
  }

  drawBoard(){
    for(let y = 0; y < 10; y++){
      for(let x = 0; x < 10; x++){
        this.colorCell(this.cells[y][x].color, this.cells[y][x].x, this.cells[y][x].y)

        this.context.strokeRect(x*40, y*40, 40, 40)
      }
    }
  }

  colorCell(color: string, x: number, y: number){
    this.context.fillStyle = color
    this.context.fillRect(x * 40, y * 40, 40, 40)
    this.context.strokeRect(x * 40, y * 40, 40, 40)
  }

  start(){
    this.mode = 1;
    this.gameService.mode.next(1)
    this.writing = "Place ship with " + this.shipBoards[this.shipBoardsIdx] + " boards"
  }

  ready(){
    if(this.enemy == null){
      this.writing = "Wait for your enemy!"
    }

    this.mode = 3;

    this.iAmReady = true;

    if(this.enemyReady){
      this.mode = 4;
      this.cleanMyBoard();
      this.gameService.mode.next(4)
      this.gameService.enemy.next(this.enemy)
    }

    let message: SeaBattleMessage = new SeaBattleMessage();
    message.status = 3;

    this.gameService.sendMessage(message);
  }

  ngOnDestroy() {
    this.gameService.closeWebSocket()

    location.reload()

    this.gameService.reloadService();
  }

  goToLobby() {

    this.router.navigateByUrl("/lobby")
  }
}
