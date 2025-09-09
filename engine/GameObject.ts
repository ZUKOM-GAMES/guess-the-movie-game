// src/engine/GameObject.ts
import { Renderer } from "./Renderer";
import { Input } from "./Input";

export abstract class GameObject {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  abstract update(dt: number, input: Input): void;
  abstract draw(renderer: Renderer): void;
}
