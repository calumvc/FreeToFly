
export default function gameLoop(){
  var timer; // timer for the game
  var score;
  var gaming; // boolean for alive

  setInterval(tick, 1000);
}

function tick(){
  console.log("Hey");
  console.log(timer);
  timer++;
}
