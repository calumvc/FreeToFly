function createPlane(path) {
  const plane = new Object({
    path: path,
    currentPos: path[0],
  });
  return plane;
}

function getCurrentPlanePos(plane) {
  return plane.currentPos;
}

//returns 0 if plane has completed its path, 1 otherwise
export function updateCurrentPlanePos(plane) {
  var index = path.indexOf(currentPos);
  if (index == path.length) {
    return 0;
  }
  plane.currentPos = path[index + 1];
  return 1;
}

function checkCollision(planes) {
  for (let i = 0; i < planes.length; i++) {
    for (let j = 0; i < planes.length; i++) {
      var distance = findDistance(plane1, plane2);
      if (distance <= MAX_DISTANCE_UNTIL_COLLISION) {
        return [i, j];
      }
    }
  }
  return 0;
}

function findDistance(plane1, plane2) {
  return Math.sqrt(
    Math.abs(plane1.currentPos[0] - plane2.currentPos[0]) ** 2 +
      Math.abs(plane1.currentPos[1] - plane2.currentPos[1]) ** 2
  );
}
