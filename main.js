//might add another event listener to start game in the future
var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 1600
    this.canvas.height = 900
    this.canvas.id = "canvas"
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }
}

gameArea.start();
