import { placePlane, placeAirport, placeBackground } from "./helpRender.js";
import { createAirport, currentAirports } from "./airport.js";
import { updateCurrentPlanePos, createPlane } from "./plane.js";
import { gameArea } from "../main.js";

var timer = 1; // game timer
var score = 0; // user's score
var gaming; // boolean for alive
var level = 1;
const LEVELTIME = 20;
var live_planes = [];

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
}

const tick = () => {
  if (gaming === false) {
    // if player dies
    clearInterval();
    gameOver();
    return;
  }

  placeBackground(gameArea.context);

  live_planes.forEach((plane) => {
    placePlane(
      gameArea.context,
      plane.currentPos[0],
      plane.currentPos[1],
      plane.rotation
    );
    if(updateCurrentPlanePos(plane) == 0){
      var index = live_planes.indexOf(plane);
      live_planes.splice(index,1);
    }

  });

  currentAirports.forEach((airport) => {
    placeAirport(
      gameArea.context,
      airport.location[0],
      airport.location[1],
      airport.colour,
      airport.type
    );
  });

  if (timer % Math.round(LEVELTIME / (level * 1.5)) == 0 || timer == 2) {
    // logic to spawn planes, increasing as the level increments{
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

export function spawnAirport() {}

export function spawnPlane() {}
