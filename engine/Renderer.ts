// src/engine/Renderer.ts
export class Renderer {
  constructor(public ctx: CanvasRenderingContext2D) {}

  drawRect(x: number, y: number, w: number, h: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  drawText(text: string, x: number, y: number, color: string = "black") {
    this.ctx.fillStyle = color;
    this.ctx.font = "20px Arial";
    this.ctx.fillText(text, x, y);
  }

  drawImage(img: HTMLImageElement, x: number, y: number, w?: number, h?: number) {
    if (w && h) {
      this.ctx.drawImage(img, x, y, w, h);
    } else {
      this.ctx.drawImage(img, x, y);
    }
  }

  measureText(text: string, font: string = "20px Arial"): number {
    this.ctx.font = font;
    return this.ctx.measureText(text).width;
  }

  getScreenCenter(): { x: number; y: number }
  {
    return { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 2 };
  }
}
