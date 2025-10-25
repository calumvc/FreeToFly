const bg = (() => {
    let bgObj = document.createElement("img");
    bgObj.src = "./assets/world_map.png"
    return bgObj
})();

export function placePlane(context, x, y, deg=0) {
    console.log(deg);
    return placeURL("./assets/plane.png", context, x, y, deg);
}

// expects unix time for startTime and endTime
export function slidePlane(context, xA, yA, xB, yB, startTime, endTime, deg=-1)
{
    const now = (new Date()).getTime(); // unix miliseconds
    const target = endTime-startTime
    const progressed = now-startTime

    let lerpValue = progressed/target
    let currentX = xA+lerpValue*(xB-xA)
    let currentY = yA+lerpValue*(yB-yA)
    placePlane(context, currentX, currentY, deg)

    if (lerpValue > 1.0) return;

    window.requestAnimationFrame(() => {slidePlane(context, xA, yA, xB, yB, startTime, endTime, deg)});
}

export function placeAirport(context, x, y, colour, radius=4) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = colour;
    context.fill();
    context.lineWidth = 4;
}

export function placeURL(src, context, x, y, deg=0) {
    let imgObj = document.createElement("img");
    imgObj.src = src

    // draw image at 0,0 and restore un-adjusted canvas draw settings
    imgObj.onload = () => {
        // save current canvas rotation/position
        context.save();
        context.translate(x, y); // translate the canvas positionare yall at the
        context.rotate(deg*Math.PI/180); // rorate the canvas draw pos

        context.drawImage(imgObj, 0, 0);

        context.restore(); }
}

export function placeBackground(context) {
    context.drawImage(bg, 0, 0);
}
