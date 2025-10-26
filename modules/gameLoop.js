import { placePlane, slidePlane, placeAirport, placeBackground, placeErrorImg, placeExplosion } from "./helpRender.js";
import { createAirport, currentAirports, currentAirportNames } from "./airport.js";
import { updateCurrentPlanePos, createPlane, checkCollision } from "./plane.js";
import { gameArea } from "../main.js";

var timer = 1; // game timer
var score = 0; // user's score
var gaming; // boolean for alive
var level = 1;
const LEVELTIME = 20;
const LEEWAY = 20;
const GAMETIME = 300;
const MAXAIRPORTTIME = 30;
const TICKSPEED = 1000;
var live_planes = [];
var pathCounter = 0;
var pathsArray = [];
var currentNote = "Welcome to FreeToFly, start by dragging a between two airports of the same colour!"
var pastNote = "previous notes will go here..."; // this is for the user to read so they know whats previous and whats not

var colours = [
  "rgb(220,25,0)",
  "rgba(8, 82, 193, 1)",
  "rgba(230, 114, 168, 1)",
  "rgba(141, 14, 183, 1)",
  "rgba(3, 120, 59, 1)",
  "rgba(230, 179, 13, 1)",
  "rgba(255, 126, 6, 1)",
  "rgba(48, 174, 56, 1)",
  "rgba(116, 81, 42, 1)",
  "rgba(22, 170, 181, 1)",
  "rgba(0, 5, 97, 1)",
  "rgba(126, 4, 2, 1)",
  "rgba(70, 78, 77, 1)",
  "rgba(129, 145, 5, 1)",
  "rgba(153, 121, 210, 1)",
];

export default function gameLoop() {
  setInterval(tick, TICKSPEED);
}

const tick = () => {
  if (gaming === false) {
    // if player dies
    clearInterval();
    return;
  }

  console.log("Past note ->", pastNote); // these will go in the nice text box along with score
  console.log("Current note ->", currentNote);
  verifyPaths(); // verifies all line strokes in the queue, 

  placeBackground(gameArea.context);
  placeErrorImg(gameArea.context);

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
            now+TICKSPEED, // ??? tick period.. i.e. the animation ends in time for next tick
            plane.rotation
        );
    }
    var crash = checkCollision(live_planes);
    if(crash != 0){
      placeExplosion(live_planes[crash[0]].currentPos[0], live_planes[crash[0]].currentPos[1]);
      pastNote = currentNote;
      currentNote = "There was a crash! " + live_planes[crash[0]].name + " and " + live_planes[crash[1]].name + " collided!";
      console.log("CRASH");
      gaming = false;
    }

    if(updateCurrentPlanePos(plane) == 0){
      var index = live_planes.indexOf(plane);
      var airportAIndex = currentAirports.indexOf(plane.airportA);
      currentAirports.splice(airportAIndex,1);
      currentAirportNames.splice(airportAIndex,1);
      var airportBIndex = currentAirports.indexOf(plane.airportB);
      pastNote = currentNote;
      currentNote = "Flight from " + plane.airportA.name + " to " + plane.airportB.name + " reached its destination safely! (+5 points)";
      currentAirports.splice(airportAIndex,1);
      currentAirports.splice(airportBIndex,1);
      currentAirportNames.splice(airportBIndex,1);
      live_planes.splice(index,1);
      score += 5

      plane.layerCanvasContext.canvas.remove()
    }


  });

  currentAirports.forEach((airport) => {
    // console.log(airport.flashed)
    placeAirport(
      gameArea.context,
      airport.location[0],
      airport.location[1],
      airport.colour,
      airport.flashed ? 6 : 4
    );
    airport.timeElapsed += 1;

    var index = currentAirports.indexOf(airport);

    if(airport.type === "OUTGOING" && airport.inUse == true){
      currentAirports.splice(index,1);
      currentAirportNames.splice(index,1);
    }

    if(airport.timeElapsed >= MAXAIRPORTTIME && airport.type === "OUTGOING"){
      currentAirports.splice(index,1);
      pastNote = currentNote;
      currentNote = airport.name + " didn't hear anything from you! They took back their request. (-10 points)";
      score -= 10;
    }

    if(airport.timeElapsed >=MAXAIRPORTTIME && airport.inUse == false){
      currentAirports.splice(index,1);
      currentAirportNames.splice(index,1);
    }

    if (airport.type === "OUTGOING") {
      airport.flashed = !airport.flashed;
    }
  });

  if (timer % Math.round(LEVELTIME / (level * 1.5)) == 0 || timer == 2) {
    // logic to spawn planes, increasing as the level increments
    spawnMission(); }

  console.log("Timer :", timer);
  if (timer % LEVELTIME == 0) {
    level++;
    console.log("Level :", level);
  }
  timer++;

  if (timer === GAMETIME) {
    gaming = false;
    gameOver();
  }
};

export function gameOver() {
  //console.log("GAME OVER!!");
  let div = document.createElement("div");
  div.classList.add("gameover");
  let p1 = document.createElement("p");
  p1.id = "p1";
  let p2 = document.createElement("p");
  let i = document.createElement("div");
  i.classList.add("GO_image");
  p1.textContent = "PLANE CRASH... GAME OVER...";
  p2.textContent = "Your final score: " + score;
  div.append(i,p1,p2);
  document.body.appendChild(div);
}

export function spawnMission() {
  var colour = colours[0];
  colours.push(colours[0]);
  colours.shift();
  var aportA = createAirport(colour, "OUTGOING"); // create sender airport?
  var aportB = createAirport(colour, "INCOMING"); // create recipient airport?
  pastNote = currentNote;
  currentNote = "Flight from " + aportA.name + " to " + aportB.name + " is looking for direction!";
}

function cleanPath(path){
  var clean = [];
  for(let i = 0; i < path.length; i+=2){
    var tempCoords = [path[i][1], path[i][2]];
    clean.push(tempCoords);
  }
  // console.log(clean);
  return clean
}
export function verifyPaths(){
  for (pathCounter; pathCounter < pathcount; pathCounter++){ // global pathcount shared with pathtrack.js
    var pathToVerify = pathsDic[pathCounter];
    verify(pathToVerify);
  }
}

export function verify(path){
  if (path[1][0] === undefined){
    return;
  }
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

              airportA.inUse = true;
              airportB.inUse = true;
              
              pastNote = currentNote;
              currentNote = airportA.name + " received your route to " + airportB.name + ". Bon Voyage!";

              pathsArray.push(cleanPath(path[1]));
              live_planes.push(createPlane(cleanPath(path[1]),airportA,airportB));
              return; 
            }
          }
        }
      }
    }
  }
  pastNote = currentNote;
  currentNote = "Invalid flight path!";
}
