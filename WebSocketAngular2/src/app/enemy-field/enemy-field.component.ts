import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Cell} from "../models/cell";
import {SeaBattleMessage} from "../models/SeaBattleMessage";
import {GameService} from "../services/game.service";

@Component({
  selector: 'app-enemy-field',
  templateUrl: './enemy-field.component.html',
  styleUrls: ['./enemy-field.component.css']
})
export class EnemyFieldComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private gameService: GameService) { }

  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;

  cells: Cell[][] = [];

  shipsRemaining: number = 20;

  ships: number[][] = [];

  mode: number = 0;
  turn!: string;
  nickname!: string;

  ngOnInit(): void {
    this.clean()

    this.gameService.mode.subscribe(data => {
      if(data == 0){
        //this.clean()

      }
      this.mode = data;
    })

    this.gameService.enemy.subscribe(data => {
      this.nickname = data;
    })

    this.gameService.turn.subscribe(data => {
      this.turn = data;
    })

    this.gameService.enemySeaBattleMessage.subscribe(data => {
      if(data.status == 5){
        if(data.hitStatus == 1){

          this.cells[data.y][data.x].filled = true;
          this.cells[data.y][data.x].color = Cell.color_fail;

          this.gameService.turn.next(data.turn)

          this.drawBoard();
        } else if(data.hitStatus == 2){

          this.shipsRemaining--;

          this.cells[data.y][data.x].filled = true;
          this.cells[data.y][data.x].color = Cell.color_hit;
          this.cells[data.y][data.x].shipId = data.shipId;

          this.ships[data.shipId].push(data.x)
          this.ships[data.shipId].push(data.y)

          let x: number[] = [];
          let y: number[] = [];

          if(data.destroyedShip){
            for(let i = 0; i < this.ships[data.shipId].length; i++){
              if(i % 2 == 0){
                x.push(this.ships[data.shipId][i])
              } else {
                y.push(this.ships[data.shipId][i])
              }
            }
          }

          x.sort((a, b) => {return a - b})
          y.sort((a, b) => {return a - b})

          let y_min = y[0] - 1;
          let y_max = y[y.length-1] + 1;
          let x_min = x[0] - 1;
          let x_max = x[x.length-1] + 1;
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

          for(let i = 0; i < x.length; i++){

            this.cells[y[i]][x[i]].color = Cell.color_hit;
          }

          this.drawBoard();
        }

      }
    })
  }

  clean(){
    for(let y = 0; y < 10; y++){
      let tempCells: Cell[] = []

      let tempShips: number[] = [];
      this.ships.push(tempShips);

      for(let x = 0; x < 10; x++){
        let color: string = Cell.color_water

        let cell = new Cell(x, y, color)

        tempCells.push(cell)
      }

      this.cells.push(tempCells)
    }

    this.shipsRemaining = 20;
  }

  ngAfterViewInit(): void {
    this.canvas = <HTMLCanvasElement> document.getElementById("enemyCanvas")
    this.context = <CanvasRenderingContext2D> this.canvas.getContext("2d")

    //this.clean()

    this.drawBoard()

    this.canvas.addEventListener("click", (event) => {
      if(this.mode != 4) return;
      if(this.nickname == this.turn) return;

      this.shoot((event.pageX - this.canvas.offsetLeft)/40 | 0, (event.pageY - this.canvas.offsetTop)/40 | 0)

      //console.log((event.pageX - this.canvas.offsetLeft)/40 | 0, (event.pageY - this.canvas.offsetTop)/40 | 0)
    }, false)

  }

  shoot(x: number, y:number){
    if(this.cells[y][x].filled) return;


    let message: SeaBattleMessage = new SeaBattleMessage();
    message.status = 4;
    message.x = x;
    message.y = y;

    this.gameService.sendMessage(message);
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

  ngOnDestroy(): void {
  }

}
