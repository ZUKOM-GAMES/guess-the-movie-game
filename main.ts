// src/main.ts
import { Game } from "./engine/Game";
import { GameObject } from "./engine/GameObject";
import { Renderer } from "./engine/Renderer";
import { Input } from "./engine/Input";

class GameManager extends GameObject {
  private color = "black";
  // Track previous mouse state for debouncing
  private _mouseWasDown: boolean = false;

  update(dt: number, input: Input): void {
    if(!hasStarted && input.mouseDown)
    {
      hasStarted = true;
      timer.running = true;
    }

    if(restarted) {
      deck.showQuestion = false;
    }

    // Only allow turn change on mouseDown if mouse was previously up (debounce)
    if (deck.showQuestion && input.mouseDown && !restarted && !this._mouseWasDown) {
      if (timer.playerTurn == 1) timer.playerTurn = 2;
      else if (timer.playerTurn == 2) timer.playerTurn = 1;
      this._mouseWasDown = true;
    }
    if (!input.mouseDown) {
      this._mouseWasDown = false;
    }

    if(gameOver.visible && input.mouseDown) restarted = true;

    if (restarted) {
      setTimeout(() => {
      restarted = false;
      }, 1000);
    }
  }

  draw(renderer: Renderer): void {
      
    }
}

class RoundTimer extends GameObject {
  private color = "black";
  public p1_timeLeft: number = 60; // seconds
  public p2_timeLeft: number = 60; // seconds
  public totalTime: number = 60; // seconds
  private seconds: string = "0";
  public running: boolean = true;
  public playerTurn: number = 1; // 1 or 2

  update(dt: number, input: Input): void {
    if(this.p1_timeLeft <= 0 || this.p2_timeLeft <= 0)
    {
      this.running = false;
      gameOver.visible = true;
    }

    if(restarted)
    {
      this.p1_timeLeft = this.totalTime;
      this.p2_timeLeft = this.totalTime;
      this.running = true;
    }

    if(this.playerTurn == 1) this.seconds = this.p1_timeLeft.toFixed(0);
    if(this.playerTurn == 2) this.seconds = this.p2_timeLeft.toFixed(0);

    if(!this.running) return;
    if(this.playerTurn == 1) this.p1_timeLeft -= dt;
    if(this.playerTurn == 2) this.p2_timeLeft -= dt;


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

  private clickSound: HTMLAudioElement = new Audio("assets/blip.mav");
  private sprite: HTMLImageElement;

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
    this.sprite = new Image();
    this.sprite.src = "assets/guess_card.png";
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

  public showQuestion: boolean = false;
  private canClick: boolean = true;

  // 🔹 Lógica que se ejecuta en cada frame
  update(dt: number, input: Input): void {
    if (input.mouseDown && this.canClick) {
      this.drawRandomQuestion();
      this.showQuestion = true;
      this.clickSound.play();
      this.canClick = false; // Evitar múltiples clicks en un solo clic
    }

    if(restarted) this.canClick = true;
  }

  // 🔹 Mostrar una pregunta aleatoria
  private drawRandomQuestion(): void {
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    this.currentQuestion = this.questions[randomIndex] ?? "";
    console.log("Nueva pregunta:", this.currentQuestion);
  }

  draw(renderer: Renderer): void {
    if(!this.showQuestion || gameOver.visible) return;
    // 🟪 Dibujar el rectángulo del mazo
    if (this.sprite.complete) {
      const canvasWidth = renderer.ctx.canvas.width;
      const canvasHeight = renderer.ctx.canvas.height;
      const centerX = (canvasWidth - this.width) / 2;
      const centerY = (canvasHeight - this.height) / 2;
      renderer.drawImage(this.sprite, centerX, centerY, this.width, this.height);
      // Update deck position so text also centers
      this.x = centerX;
      this.y = centerY;
    }
    // 🟪 Dibujar el texto centrado
    const font = "20px Arial"; // mismo que en Renderer
    const textWidth = renderer.measureText(this.currentQuestion, font);

    const textX = this.x + (this.width - textWidth) / 2; // centrar horizontal

    renderer.drawText(this.currentQuestion, textX, this.y - 10, "black");
  }
}

class Player extends GameObject {
  private color = "green";

  update(dt: number, input: Input) {

  }

  draw(renderer: Renderer) {
    if(timer.playerTurn == 1)
      renderer.drawText("Player 1's Turn", 50, 20, this.color);
    else if(timer.playerTurn == 2)
      renderer.drawText("Player 2's Turn", 50, 20, this.color);
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
const deck = new QuestionDeck(50, 50, 150, 200);
const player = new Player(10, 20);
//const box = new TestBox(100, 100);
game.addObject(timer); 
game.addObject(gameOver);
game.addObject(manager);
game.addObject(deck);
game.addObject(player);

//stops the timer and sets it to the initial time to begin the match
timer.running = false;
timer.p1_timeLeft = timer.totalTime;
timer.p2_timeLeft = timer.totalTime;