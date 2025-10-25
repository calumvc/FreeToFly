import { placePlane, slidePlane, placeAirport, placeBackground } from "./helpRender.js";
import { createAirport, currentAirports } from "./airport.js";
import { updateCurrentPlanePos, createPlane } from "./plane.js";
import { gameArea } from "../main.js";

var timer = 1; // game timer
var score = 0; // user's score
var gaming; // boolean for alive
var level = 1;
const LEVELTIME = 20;
const LEEWAY = 20;
var live_planes = [];
var pathCounter = 0;
var pathsArray = [];

// const planesContext = document.getElementById('canvasPlanes').getContext('2d');
// planesContext.globalCompositeOperation = 'copy';

var colours = [
  "Blue",
  "Red",
  "Cyan",
  "Pink",
  "Purple",
  "Green",
  "Yellow",
  "Orange",
  "Lime",
  "Navy",
];

export default function gameLoop() {
  setInterval(tick, 1000);
  // setInterval(tick, 1000/60);
}

const tick = () => {
  if (gaming === false) {
    // if player dies
    clearInterval();
    gameOver();
    return;
  }
  
  // console.log(pathcount);
  // console.log(pathCounter);
  verifyPaths();

  placeBackground(gameArea.context);

  live_planes.forEach((plane) => {
    
    let now = (new Date()).getTime();
    let pathPosIndex = plane.path.indexOf(plane.currentPos);

    if (pathPosIndex < plane.path.length-1)
    {
        slidePlane(
            // gameArea.context,
            plane.layerCanvasContext,
            plane.path[pathPosIndex][0],
            plane.path[pathPosIndex][1],
            plane.path[pathPosIndex+1][0],
            plane.path[pathPosIndex+1][1],
            now,
            now+1000, // 1000ms tick period.. i.e. the animation ends in time for next tick
            plane.rotation
        );
    }
    else if (false)
    {
        placePlane(
            gameArea.context,
            plane.currentPes[0],
            plane.currentPos[1],
            plane.rotation
        );
    }

    if(updateCurrentPlanePos(plane) == 0){
      var index = live_planes.indexOf(plane);
      var airportAIndex = currentAirports.indexOf(plane.airportA);
      currentAirports.splice(airportAIndex,1);
      var airportBIndex = currentAirports.indexOf(plane.airportB);
      currentAirports.splice(airportBIndex,1);
      live_planes.splice(index,1);
      score += 5

      plane.layerCanvasContext.canvas.remove()
    }

  });

  currentAirports.forEach((airport) => {
    console.log(airport.flashed)
    placeAirport(
      gameArea.context,
      airport.location[0],
      airport.location[1],
      airport.colour,
      airport.flashed ? 6 : 4
    );

    if (airport.type === "INCOMING") {
      airport.flashed = !airport.flashed;
    }
  });

  if (timer % Math.round(LEVELTIME / (level * 1.5)) == 0 || timer == 2) {
    // logic to spawn planes, increasing as the level increments
    spawnMission();
  }

  console.log(timer);
  if (timer % LEVELTIME == 0) {
    level++;
    console.log("Level incremented");
    console.log(level);
  }
  timer++;

  if (timer === 120) {
    gaming = false;
  }
};

export function gameOver() {
  console.log("GAME OVER!!");
}

export function spawnMission() {
  console.log("Mission from airport A to airport B");
  var colour = colours[0];
  colours.push(colours[0]);
  colours.shift();
  createAirport(colour, "OUTGOING"); // create sender airport?
  createAirport(colour, "INCOMING"); // create recipient airport?
}

function cleanPath(path){
  var clean = [];
  for(let i = 0; i < path.length; i+=2){
    var tempCoords = [path[i][1], path[i][2]];
    clean.push(tempCoords);
  }
  console.log(clean);
  return clean
}
export function verifyPaths(){
  for (pathCounter; pathCounter < pathcount; pathCounter++){
    var pathToVerify = pathsDic[pathCounter];
    verify(pathToVerify);
  }
}


export function verify(path){
  var startPoint = [path[1][0][1], path[1][0][2]];
  var endPointReference = path[1];
  var endPointLength = endPointReference.length-1;
  var endPoint = [path[1][endPointLength][1], path[1][endPointLength][2]];

  for (let k = 0; k < currentAirports.length; k++) { // logic to determine if its valid
    if (currentAirports[k].type === "OUTGOING"){
      if (currentAirports[k].location[0] - startPoint[0] < LEEWAY && currentAirports[k].location[0] - startPoint[0] > -LEEWAY){
        if (currentAirports[k].location[1] - startPoint[1] < LEEWAY && currentAirports[k].location[1] - startPoint[1] > -LEEWAY){
          console.log("START POINT IS VALID");
          var airportA = currentAirports[k];

          var airportB;
          currentAirports.forEach(a => {
            if (a.type == "INCOMING" && a !== airportA && a.colour === airportA.colour){
              airportB = a;
            }
          });

          if (airportB.location[0] - endPoint[0] < LEEWAY && airportB.location[0] - endPoint[0] > -LEEWAY){
            if (airportB.location[1] - endPoint[1] < LEEWAY && airportB.location[1] - endPoint[1] > -LEEWAY){
              console.log("END POINT IS VALID");

              pathsArray.push(cleanPath(path[1]));
              live_planes.push(createPlane(cleanPath(path[1]),airportA,airportB));
              return; 
            }
          }
        }
      }
    }
  }
}
