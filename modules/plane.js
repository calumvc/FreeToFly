const MAX_DISTANCE_UNTIL_COLLISION = 22;

function makePlaneLayer(){
    let canv = document.createElement("canvas");
    canv.width = 1920;
    canv.height = 1080;
    canv.style.zIndex = 0;
    canv.className = "planeCanvas";
    document.getElementById("canvasPath").insertAdjacentElement("afterend", canv)
    canv.getContext("2d").globalCompositeOperation = 'copy';
    return canv;
}

export function createPlane(path,airportA,airportB){
    const plane = new Object({
        path: path,
        currentPos: path[2],
        rotation: 0,
        airportA: airportA,
        airportB: airportB,
        layerCanvasContext: makePlaneLayer().getContext("2d")
    });
    plane.rotation = calcRotation(plane);
    return plane;
}

export function updateCurrentPlanePos(plane){ //returns 0 if plane has completed its path, 1 otherwise 
    var index = plane.path.indexOf(plane.currentPos);
    if(index == plane.path.length-1){
        return 0;
    }
    plane.currentPos = plane.path[index+1];
    plane.rotation = calcRotation(plane);
    return 1;
}

export function checkCollision(planes){
    for(let i = 0; i < planes.length; i++){
        for(let j = 1; j < planes.length; j++){
            var distance = findDistance(planes[i], planes[j]);
            if(distance <= MAX_DISTANCE_UNTIL_COLLISION && i != j){
                return [i,j];
            }
        };
    };
    return 0;
}

function findDistance(plane1, plane2){
    let plane1PosX = plane1.currentPos[0]
    let plane2PosX = plane2.currentPos[0]
    let plane1PosY = plane1.currentPos[1]
    let plane2PosY = plane2.currentPos[1]
    let dist = Math.sqrt(Math.abs(plane1PosX - plane2PosX)**2 + Math.abs(plane1PosY - plane2PosY))**2;
    return dist
}

function calcRotation(plane){
    var index = plane.path.indexOf(plane.currentPos);
    if(index == plane.path.length-1){
        return 0;
    }
    var xDiff = plane.path[index+1][0] - plane.path[index][0];
    var yDiff = plane.path[index+1][1] - plane.path[index][1];
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
    else if(xDiff > 0 && yDiff < 0){
        return (Math.atan(yDiff/xDiff)*180/Math.PI) + 90;
    }
    else if(xDiff > 0 && yDiff > 0){
        return ((Math.atan(yDiff/xDiff)*180/Math.PI) + 90);
    }
    else if(xDiff < 0 && yDiff > 0){
        return ((Math.atan(yDiff/xDiff)*180/Math.PI) + 270);
    }
    else if(xDiff < 0 && yDiff < 0){
        return ((Math.atan(yDiff/xDiff)*180/Math.PI) + 270);
    }
    else{
        return 0;
    }
}
