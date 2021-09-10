export class Cell{
  x: number;
  y: number;
  shipId: number = -1;
  filled: boolean = false;
  color: string;

  static color_water: string = "rgb(41,189,227)"
  static color_fail: string = "rgb(94,105,109)"
  static color_hit: string = "rgb(173,45,45)"
  static color_ship: string = "rgb(85,69,50)"
  static color_filled: string = "rgb(85,193,100)"

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
}

