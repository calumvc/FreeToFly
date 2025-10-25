import gameLoop from ("./gameLoop");

var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 1600
    this.canvas.height = 900
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    gameLoop();
  }
}

gameArea.start();
