export class SeaBattleMessage {
  status!: number;
  player1!: string;
  player2!: string;
  x!: number;
  y!: number;
  hitStatus!: number; // -1 - error, 0 - don't hit, 1 - hit
  shipId!: number
  destroyedShip!: boolean;
  turn!: string;

}
