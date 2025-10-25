var timer = 0; // game timer
var gaming; // boolean for alive

export default function gameLoop(){
  var score;

  setInterval(tick, 1000);
}

const tick = () => {

  if (gaming === false){
    clearInterval();
    return;
  }

  console.log("Hey");
  console.log(timer);
  timer++;

  if (timer === 5){
    gaming = false;
  }

}
