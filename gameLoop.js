var timer = 1; // game timer
var score = 0; // user's score
var gaming; // boolean for alive
var level = 1;
const LEVELTIME = 20;

export default function gameLoop(){

  setInterval(tick, 1000);
}

const tick = () => {

  if (gaming === false){ // if player dies
    clearInterval();
    gameOver();
    return;
  }

  if ((timer % (LEVELTIME / (level * 2)) == 0) || (timer == 2)){
    spawnMission();
  }

  console.log(timer);
  if ((timer % LEVELTIME) == 0){
    level++;
    console.log("Level incremented");
    console.log(level);
  }
  timer++;

  if (timer === 120){
    gaming = false;
  }

}

export function gameOver(){
  console.log("GAME OVER!!");
}

export function spawnMission(){
  console.log("Mission from airport A to airport B")
}

export function spawnAirport(){}

export function spawnPlane(){}
