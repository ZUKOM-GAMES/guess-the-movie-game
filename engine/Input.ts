// src/engine/Input.ts
export class Input {
  mouseX: number = 0;
  mouseY: number = 0;
  mouseDown: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener("mousedown", () => {
      this.mouseDown = true;
    });

    canvas.addEventListener("mouseup", () => {
      this.mouseDown = false;
    });

    canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    console.log("Click en:", mouseX, mouseY);
    });

  }
}
