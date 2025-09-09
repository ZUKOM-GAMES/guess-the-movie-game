// src/main.ts
import { Game } from "./engine/Game";
import { GameObject } from "./engine/GameObject";
import { Renderer } from "./engine/Renderer";
import { Input } from "./engine/Input";

class GameManager extends GameObject {
  private color = "black";

  update(dt: number, input: Input): void {
    if(!hasStarted && input.mouseDown)
    {
      hasStarted = true;
      timer.running = true;
    }

    if(gameOver.visible && input.mouseDown) restarted = true;

    if(restarted) restarted = false;
  }

  draw(renderer: Renderer): void {
      
    }
}

class RoundTimer extends GameObject {
  private color = "black";
  public timeLeft: number = 60; // seconds
  private totalTime: number = 60; // seconds
  private seconds: string = "0";
  public running: boolean = true;

  update(dt: number, input: Input): void {
    if(this.timeLeft <= 0)
    {
      this.running = false;
      gameOver.visible = true;
    }

    if(restarted)
    {
      this.timeLeft = this.totalTime;
      this.running = true;
    }

    if(!this.running) return;
    this.timeLeft -= dt;
    this.seconds = this.timeLeft.toFixed(0);
  }

  draw(renderer: Renderer): void {
    const canvasWidth = renderer.ctx.canvas.width;
    const text = `Time: ${this.seconds}s`;
    const textWidth = renderer.measureText(text, "16px Arial");
    const x = (canvasWidth - textWidth) / 2;
    renderer.drawText(text, x, this.y, this.color);
  }
}

class GameOverScreen extends GameObject {
  private color = "black";
  public visible: boolean = false;
  private message: string = "Game Over";

  update(dt: number, input: Input): void {
    this.visible = this.visible

    if(restarted) this.visible = false;
  }

  draw(renderer: Renderer) {
    if (!this.visible) return;
    renderer.drawRect(200, 200, 400, 200, "rgba(0, 0, 0, 0.7)");
    renderer.drawText(this.message, 350, 300, "white");
  }
}

class QuestionDeck extends GameObject {
  x: number = 50;
  y: number = 50;
  width: number = 100;
  height: number = 150;

  private color = "#9112BC";
  private questions: string[] = [
    "Movies that have babies",
    "Comedy movies",
    "Shows set in high school",
    "Movies about superheroes",
    "Animated movies",
    "Movies with talking animals",
    "Romantic comedies",
    "Movies set in space",
    "Sports movies",
    "Movies with time travel",
    "Movies with car chases",
    "Movies set in the future",
    "Movies based on true stories",
    "Movies with detectives",
    "Movies with pirates",
    "Movies with magic",
    "Movies about friendship",
    "Movies with robots",
    "Movies set in New York",
    "Movies with musical numbers",
    "Movies about families",
    "Movies with aliens",
    "Movies set in the 1980s",
    "Movies with heists",
    "Movies about teachers",
    "Movies with spies",
    "Movies with monsters",
    "Movies with twins",
    "Movies about food",
    "Movies with weddings",
    "Movies with superheroes teams",
    "Movies set in small towns",
    "Movies about animals",
    "Movies with treasure hunts",
    "Movies with haunted houses",
    "Movies about summer camps",
    "Movies with rivalries",
    "Movies with famous landmarks",
    "Movies about travel",
    "Movies with inventions",
    "Movies about growing up"
  ];

  private currentQuestion: string = this.questions[0] ?? "";

  constructor(x: number, y: number, w: number, h: number) {
    super(x, y);
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  // 🟪 Esto revisa si un punto (click) cae dentro del rectángulo del mazo
  containsPoint(px: number, py: number): boolean {
    return (
      px >= this.x &&
      px <= this.x + this.width &&
      py >= this.y &&
      py <= this.y + this.height
    );
  }

  // 🔹 Lógica que se ejecuta en cada frame
  update(dt: number, input: Input): void {
    if (input.mouseDown) {
      if (this.containsPoint(input.mouseX, input.mouseY)) {
        console.log("¡Click sobre el mazo!");
        this.drawRandomQuestion();
      }
    }
  }

  // 🔹 Mostrar una pregunta aleatoria
  private drawRandomQuestion(): void {
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    this.currentQuestion = this.questions[randomIndex] ?? "";
    console.log("Nueva pregunta:", this.currentQuestion);
  }

  draw(renderer: Renderer): void {
    // 🟪 Dibujar el rectángulo del mazo
    renderer.drawRect(this.x, this.y, this.width, this.height, this.color);
    // 🟪 Dibujar el texto de la pregunta actual
    const textX = this.x + 10;
    const textY = this.y + this.height / 2;
    renderer.drawText(this.currentQuestion, textX, textY, "black");
  }
}


/*class TestBox extends GameObject {
  private color = "blue";

  update(dt: number, input: Input) {
    if (input.mouseDown) {
      this.x = input.mouseX - 25;
      this.y = input.mouseY - 25;
      this.color = "red";
    } else {
      this.color = "blue";
    }
  }

  draw(renderer: Renderer) {
    renderer.drawRect(this.x, this.y, 75, 100, this.color);
    renderer.drawText("carta", this.x + 15, this.y + 50, "white");
  }
}*/

var hasStarted = false;
var restarted = false;

const game = new Game("gameCanvas");
const timer = new RoundTimer(10, 30);
const gameOver = new GameOverScreen(300, 250);
const manager = new GameManager(300, 50);
//const box = new TestBox(100, 100);
game.addObject(timer); 
game.addObject(gameOver);
game.addObject(manager);