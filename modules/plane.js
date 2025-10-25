function createPlane(path){
    const plane = new Object({
        path: path,
        currentPos: path[0],
        rotation: 0,
    });
    return plane;
}

function getCurrentPlanePos(plane) {
  return plane.currentPos;
}

//returns 0 if plane has completed its path, 1 otherwise 
export function updateCurrentPlanePos(plane){
    var index = path.indexOf(plane.currentPos);
    if(index == path.length){
        return 0;
    }
    plane.currentPos = path[index+1];
    plane.rotation = calcRotation(plane);
    return 1;
}

function checkCollision(planes){
    for(let i = 0; i < planes.length; i++){
        for(let j = 0; i < planes.length; i++){
            var distance = findDistance(plane1, plane2);
            if(distance <= MAX_DISTANCE_UNTIL_COLLISION){
                return [i,j];
            }
        };
    };
    return 0;
}

function findDistance(plane1, plane2){
    return Math.sqrt((Math.abs(plane1.currentPos[0] - plane2.currentPos[0]))**2 + (Math.abs(plane1.currentPos[1] - plane2.currentPos[1]))**2);
}

function calcRotation(plane){
    var rotation = 0;
    var index = path.indexOf(plane.currentPos)
    var xDiff = plane.currentPos[index+1][0] - plane.currentPos[index][0];
    var yDiff = plane.currentPos[index+1][1] - plane.currentPos[index][1];
    var modifier = 0;
    if(yDiff == 0 && xDiff > 0){
        return 90;
    }
    else if(yDiff == 0 && xDiff < 0){
        return 270;
    }
    else if(xDiff == 0 && yDiff > 0){
        return 180;
    }
    else if(xDiff == 0 && yDiff < 0){
        return 0;
    }
    else if(xDiff > 0 && ydiff < 0){
        return Math.atan(ydiff/xDiff) + 90;
    }
    else if(xDiff < 0 && yDiff < 0){
        return Math.atan(yDiff/xDiff);
    }
    else if(xDiff < 0 && yDiff > 0){
        return Math.atan(yDiff/xDiff);
    }
    else{
        return 0;
    }
}
