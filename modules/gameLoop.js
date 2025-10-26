import { placePlane, slidePlane, placeAirport, placeBackground, placeErrorImg, placeExplosion } from "./helpRender.js";
import { createAirport, currentAirports, currentAirportNames } from "./airport.js";
import { updateCurrentPlanePos, createPlane, checkCollision } from "./plane.js";
import { gameArea } from "../main.js";

var timer = 1; // game timer
var score = 0; // user's score
var gaming; // boolean for alive
var level = 1;
const LEVELTIME = 40;
const LEEWAY = 20;
const GAMETIME = 300;
const MAXAIRPORTTIME = 30;
const TICKSPEED = 1000;
var live_planes = [];
var pathCounter = 0;
var pathsArray = [];
var currentNote = "Welcome to FreeToFly, start by dragging a between two airports of the same colour!"
var pastNote = "previous notes will go here..."; // this is for the user to read so they know whats previous and whats not
var currentNoteIndex = 0; //for colour mapping
var pastNoteIndex = 0;
var hs;

var colours = [
  "rgb(220,25,0)",
  "rgba(8, 82, 193, 1)",
  "rgba(230, 114, 168, 1)",
  "rgba(123, 3, 163, 1)",
  "rgba(0, 96, 47, 1)",
  "rgba(230, 179, 13, 1)",
  "rgba(255, 126, 6, 1)",
  "rgba(61, 193, 70, 1)",
  "rgba(148, 79, 0, 1)",
  "rgba(22, 170, 181, 1)",
  "rgba(0, 6, 126, 1)",
  "rgba(145, 27, 25, 1)",
  "rgba(105, 105, 105, 1)",
  "rgba(172, 180, 117, 1)",
  "rgba(166, 137, 216, 1)",
];

export default function gameLoop() {
  setInterval(tick, TICKSPEED);
}

const tick = () => {
  if (gaming === false) {
    // if player dies
    clearInterval();
    console.log("highest score: " + hs);
    return;
  }

  // console.log("Past note ->", pastNote); // these will go in the nice text box along with score
  // console.log("Current note ->", currentNote);
  if (pastNoteIndex == 0){
    updateText(pastNote,pastNoteIndex);
  } else {
    updateText(currentNote,currentNoteIndex);
  }

  updateScore(score);
  verifyPaths(); // verifies all line strokes in the queue, 

  placeBackground(gameArea.context);
  placeErrorImg(gameArea.context);

  live_planes.forEach((plane) => {
    if (gaming == false){
      return;
    }
    
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
      placeExplosion(document.getElementById("canvasCollision").getContext("2d"), live_planes[crash[0]].currentPos[0]-16, live_planes[crash[0]].currentPos[1]-16);
      placeExplosion(document.getElementById("canvasCollision").getContext("2d"), live_planes[crash[1]].currentPos[0]-16, live_planes[crash[1]].currentPos[1]-16);
      pastNote = currentNote;
      currentNote = "There was a crash! " + live_planes[crash[0]].name + " and " + live_planes[crash[1]].name + " collided!";
      pastNoteIndex = currentNoteIndex;
      currentNoteIndex = 1;
      // console.log("CRASH");
      gaming = false;
      gameOver();
      return;
    }

    if(updateCurrentPlanePos(plane,gaming) == 0){
      var index = live_planes.indexOf(plane);
      var airportAIndex = currentAirports.indexOf(plane.airportA);
      //currentAirports.splice(airportAIndex,1);
      //currentAirportNames.splice(airportAIndex,1);
      var airportBIndex = currentAirports.indexOf(plane.airportB);
      pastNote = currentNote;
      currentNote = "Flight from " + plane.airportA.name + " to " + plane.airportB.name + " reached its destination safely! (+5 points)";
      pastNoteIndex = currentNoteIndex;
      currentNoteIndex = 2;
      //currentAirports.splice(airportAIndex,1);
      currentAirports.splice(airportBIndex,1);
      currentAirportNames.splice(airportBIndex,1);
      live_planes.splice(index,1);
      score += 5

      plane.layerCanvasContext.canvas.remove()
    }


  });
  var airportLength = currentAirports.length;
  for(let i = airportLength-1; i>=0; i--){
    placeAirport(
      gameArea.context,
      currentAirports[i].location[0],
      currentAirports[i].location[1],
      currentAirports[i].colour,
      currentAirports[i].flashed ? 6 : 4
    );
    currentAirports[i].timeElapsed += 1;

    //console.log("AIRPORT ", airport.name, airport.type);
    if(currentAirports[i].type === "OUTGOING" && currentAirports[i].inUse == true){
      currentAirports.splice(i,1);
      currentAirportNames.splice(i,1);
    }

    else if(currentAirports[i].timeElapsed >= MAXAIRPORTTIME && currentAirports[i].type === "OUTGOING"){
      currentAirports.splice(i,1);
      currentAirportNames.splice(i,1);
      currentNote = currentAirports[i].name + " didn't hear anything from you! They took back their request. (-5 points)";
      pastNoteIndex = currentNoteIndex;
      currentNoteIndex = 3;
      score -= 5;
    }

    else if(currentAirports[i].timeElapsed >=MAXAIRPORTTIME && currentAirports[i].inUse == false){
      currentAirports.splice(i,1);
      currentAirportNames.splice(i,1);
    }

    if (currentAirports[i].type === "OUTGOING") {
      currentAirports[i].flashed = !currentAirports[i].flashed;
    }
  };

  if (timer % Math.round(LEVELTIME / (level * 3)) == 0 || timer == 2) {
    // logic to spawn planes, increasing as the level increments
    spawnMission(); }

  // console.log("Timer :", timer);
  if (timer % LEVELTIME == 0 && level < 5) {
    level++;
    // console.log("Level :", level);
  }
  timer++;

  if (timer === GAMETIME) {
    gaming = false;
    gameOver();
  }
};

const colorMap = {
    0: "rgba(56, 56, 56, 1)", //welcome
    1: "rgba(187, 63, 63, 1)", //crash
    2: "rgba(23, 150, 69, 1)", //reach destination
    3: "rgba(209, 121, 21, 1)", //no interaction
    4: "rgba(44, 64, 196, 1)",  //new calling
    5: "rgba(49, 150, 190, 1)", //received route
    6: "rgba(160, 85, 148, 1)", //invalid path
};

function updateText(text,index){
  let n = document.getElementById("note");
  n.style.color = colorMap[index];
  n.textContent = text;
}

function updateScore(score){
  let s = document.getElementById("score");
  s.textContent = "Score: " + score;
}

export function gameOver() {
  hs = readHighest(hs);
  if (score > hs){
    highestScore(score); //set new highest
    hs = score;
  }
  //console.log("GAME OVER!!");
  let div = document.createElement("div");
  div.classList.add("gameover");
  let p1 = document.createElement("p");
  p1.id = "p1";
  let p2 = document.createElement("p");
  let p3 = document.createElement("p");
  p3.id = "p3";
  let i = document.createElement("div");
  i.classList.add("GO_image");
  p1.textContent = "PLANE CRASH... GAME OVER...";
  p2.textContent = "Your final score: " + score;
  p3.textContent = "Highest: " + hs;
  div.append(i,p1,p2,p3);
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
  if(aportA != null && aportB != null){
    currentNote = "Flight from " + aportA.name + " to " + aportB.name + " is looking for direction!";
    pastNoteIndex = currentNoteIndex;
    currentNoteIndex = 4;
  }
}

const thresholdUpper = 20
const thresholdLower = 10
function cleanPath(path){
  var clean = [];
  
  /*
  var nextTempCoords
  for(let i = 0; i < path.length-2; i+=2){
    var tempCoords = [path[i][1], path[i][2]];
    nextTempCoords = [path[i+2][1], path[i+2][2]];

    var xDiff = nextTempCoords[0]-tempCoords[0]
    var yDiff = nextTempCoords[1]-tempCoords[1]
    var segLen = Math.sqrt((xDiff)**2 + (yDiff)**2)

    // if dist to next point is longer than we'd want..
    if (segLen > thresholdUpper)
    {
      // find how many sub-segments we want
      let divCount = segLen / thresholdUpper
      let xComponent = xDiff / divCount
      let yComponent = yDiff / divCount

      // start at the segment origin, and slowly push the segment in smaller chunks
      for (let d = 0 ; d < divCount ; d++)
        clean.push([tempCoords[0]+d*xComponent, tempCoords[1]+d*yComponent])
    }
    else if (segLen < thresholdLower) // skip segments too short.
    {
      continue;
    }
    else { clean.push(tempCoords); } // segment isnt too big; can just send it through.
  }
  clean.push(nextTempCoords)
  return clean;
  */

  for(let i = 0; i < path.length; i+=2){
    var tempCoords = [path[i][1], path[i][2]];
    clean.push(tempCoords);
  }
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
          // console.log("START POINT IS VALID");
          var airportA = currentAirports[k];

          var airportB;
          currentAirports.forEach(a => {
            if (a.type == "INCOMING" && a !== airportA && a.colour === airportA.colour){
              airportB = a;
            }
          });

          if (airportB.location[0] - endPoint[0] < LEEWAY && airportB.location[0] - endPoint[0] > -LEEWAY){
            if (airportB.location[1] - endPoint[1] < LEEWAY && airportB.location[1] - endPoint[1] > -LEEWAY){
              // console.log("END POINT IS VALID");

              airportA.inUse = true;
              airportB.inUse = true;
              
              pastNote = currentNote;
              currentNote = airportA.name + " received your route to " + airportB.name + ". Bon Voyage!";
              pastNoteIndex = currentNoteIndex;
              currentNoteIndex = 5;
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
  pastNoteIndex = currentNoteIndex;
  currentNoteIndex = 6;
}

function highestScore(score){
  const xmlDoc = document.implementation.createDocument("", "", null);
  const root = xmlDoc.createElement("HighestScore");

  function createElement(name, value) {
    const element = xmlDoc.createElement(name);
    element.textContent = value;
    return element;
  }
  const highestScore = xmlDoc.createElement("HS");
  highestScore.appendChild(createElement("score", score));
  root.appendChild(highestScore);
  xmlDoc.appendChild(root);

  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(xmlDoc);
  localStorage.setItem("HighestScore", xmlString);
}

function readHighest(){
  const xmlString = localStorage.getItem("HighestScore");
  if (xmlString == null){
    return 0;
  } else {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const Highest = xmlDoc.querySelector("HighestScore");
    return parseInt(Highest.querySelector("HS").querySelector("score").textContent);
  }
}