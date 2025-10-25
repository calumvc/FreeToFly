const bg = (() => {
    let bgObj = document.createElement("img");
    bgObj.src = "./assets/world_map.png"
    return bgObj
})();

let imgObj = (() => {
    let imgObj = document.createElement("img");
    imgObj.src = ""
    return imgObj
})();

export function placePlane(context, x, y, deg=0) {
    console.log(deg);
    return placeURL("./assets/plane.png", context, x, y, deg);
}
export function placeAirport(context, x, y, colour) {
    const radius = 4
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = colour;
    context.fill();
    context.lineWidth = 4;
}

export function placeURL(src, context, x, y, deg=0) {
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
