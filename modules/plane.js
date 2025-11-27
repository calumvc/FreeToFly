const MAX_DISTANCE_UNTIL_COLLISION = 10;

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
            var distance = findDistanceNearest(planes[i], planes[j]);
            if(distance <= MAX_DISTANCE_UNTIL_COLLISION && i != j){
                return [i,j];
            }
        };
    };
    return 0;
}

function findDistanceNearest(plane1, plane2){
    let plane1PosX = plane1.currentPos[0]
    let plane2PosX = plane2.currentPos[0]
    let plane1PosY = plane1.currentPos[1]
    let plane2PosY = plane2.currentPos[1]

    // maths time:
    // plane1 and plane2 has relative speed
    // so 2 movements are combined into 1 movement (suppose 1 is moving and 1 is fixed)
    // then there's a minimum distance occuring at some point (use a quadratic equation to compute)
    // calculate it and return the min distance
    let index1 = plane1.path.indexOf(plane1.currentPos);
    let index2 = plane2.path.indexOf(plane2.currentPos);
    let plane1LastPosX = plane1.path[index1-1][0];
    let plane2LastPosX = plane2.path[index2-1][0];
    let plane1LastPosY = plane1.path[index1-1][1];
    let plane2LastPosY = plane2.path[index2-1][1];

    let relativeX = (plane1PosX - plane1LastPosX) - (plane2PosX - plane2LastPosX);
    let relativeY = (plane1PosY - plane1LastPosY) - (plane2PosY - plane2LastPosY);
    let relativePosX = plane1LastPosX - plane2LastPosX;
    let relativePosY = plane1LastPosY - plane2LastPosY;

    let a = relativeX**2 + relativeY**2;
    let b = 2 * (relativePosX * relativeX + relativePosY * relativeY);

    //the lowest point occurs exactly at -b/2a position
    let t = 0;
    if (a > 1e-12){ //float point number issues will occur here
        t = -b/(2*a);
        t = Math.max(0, Math.min(1, t)); //restricting t to be in the range of [0,1]
    } else {
        t = 0;
    }

    let Dx = relativePosX + relativeX * t;
    let Dy = relativePosY + relativeY * t;

    let dist = Math.sqrt(Dx**2 + Dy**2);
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
