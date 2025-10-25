//might add another event listener to start game in the future
import gameLoop from "./modules/gameLoop.js";
import { placeBackground } from "./modules/helpRender.js";

export var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 1920;
    this.canvas.height = 1080;
    this.canvas.id = "canvas";
    this.context = this.canvas.getContext("2d");
    this.canvas.style = "position:absolute; left:50; top:50; z-index:0;"
    placeBackground(this.context);
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);

    canvas.addEventListener('click', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            console.log(x + ", " + y);
        });
    gameLoop();
  }
}

gameArea.start();
