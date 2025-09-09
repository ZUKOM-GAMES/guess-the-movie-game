// src/engine/Game.ts
import { Renderer } from "./Renderer";
import { Input } from "./Input";
import { GameObject } from "./GameObject";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: Renderer;
  private input: Input;
  private objects: GameObject[] = [];
  private lastTime: number = 0;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.renderer = new Renderer(this.ctx);
    this.input = new Input(this.canvas);

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  addObject(obj: GameObject) {
    this.objects.push(obj);
  }

  private gameLoop(timestamp: number) {
    const delta = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // Update
    this.objects.forEach(obj => obj.update(delta, this.input));

    // Render
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.objects.forEach(obj => obj.draw(this.renderer));

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}
