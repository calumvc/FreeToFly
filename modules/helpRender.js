export function placePlane(context, x, y, deg=0) {
    return placeURL("./assets/plane.jpg", context, x, y, deg);
}
export function placeAirport(context, x, y) {
    const radius = 20
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
    context.lineWidth = 4;
    context.strokeStyle = "blue";
    context.stroke();
}

export function placeURL(src, context, x, y, deg=0) {
    let imgObj = document.createElement("img");
    imgObj.src = src

    // save current canvas rotation/position
    context.save();
    context.translate(x, y); // translate the canvas position
    context.rotate(deg*Math.PI/180); // rorate the canvas draw pos

    // draw image at 0,0 and restore un-adjusted canvas draw settings
    imgObj.onload = () => { context.drawImage(imgObj, 0, 0); context.restore(); }
}

