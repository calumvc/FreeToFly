window.addEventListener("DOMContentLoaded", (e) => {
    const canvas = document.getElementById('canvasPath');
    const ctx = canvas.getContext('2d');
    var record = [];
    var flag = 0;
    var firstDraw = 0; //get rid of random line from top left
    var lastposition = [0, 0];
    var currentPath = [];


    function singleRecord(event, record) {
        if (event.type == "mousemove") {
            var x = event.clientX;
            var y = event.clientY;
        }
        else if (event.type == "touchmove") {
            let touch = event.touches[0]
            var x = touch.clientX;
            var y = touch.clientY;
        }
        else { console.log("panic! singleRecord given a non-mouse non-touch event! how did this happen :("); }

        record.push([x, y]);

        if (firstDraw == 0) {
            firstDraw = 1;
        } else {
            ctx.beginPath();
            ctx.moveTo(lastposition[0], lastposition[1]);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();
            currentPath.push(["line", lastposition[0], lastposition[1], x, y]);
        }

        lastposition = [x, y];
        drawdot(x, y);
    }

    function compareDistance(event,lastpos){ //only record after some distance moved
        if (event.type == "mousemove") {
            currentX = event.clientX;
            currentY = event.clientY;
        }
        else if (event.type == "touchmove") {
            let touch = event.touches[0]
            currentX = touch.clientX;
            currentY = touch.clientY;
        }
        else { console.log("panic! compareDistance given a non-mouse non-touch event! how did this happen :("); }

        lastX = lastpos[0];
        lastY = lastpos[1];
        if ((currentX - lastX)**2 + (currentY - lastY)**2 > 20){ // modify the number to determine the distance between path dots
            return 1;
        }else {
            return 0;
        }
    }

    function drawdot(x, y) {
        ctx.beginPath();
        ctx.fillStyle = "grey";
        ctx.arc(x, y, 0, 0, 2 * Math.PI); // 2 is the radius in case you wanna change
        ctx.fill();
        ctx.closePath();
        currentPath.push(["dot", x, y, 2, 0, 2 * Math.PI]);
    }

    function addValidPath() {
        pathsDic[pathcount].push(record);
        pathsDic[pathcount].push(currentPath);
    }

    const pathStartHandler = (e) => {
        flag = 1;
        pathsDic[pathcount] = []
    }
    canvas.addEventListener('touchstart', pathStartHandler);
    canvas.addEventListener('mousedown', pathStartHandler);

    const pathDrawHandler = (e) => {
        if (flag == 1) {
            if (compareDistance(e, lastposition) == 1) {
                singleRecord(e, record);
            }
        }
    }
    canvas.addEventListener('mousemove', pathDrawHandler);
    canvas.addEventListener('touchmove', pathDrawHandler);

    const pathEndHandler = (e) => {
        flag = 0;
        firstDraw = 0;
        record = [];
        addValidPath();
        currentPath = [];
        pathcount++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    canvas.addEventListener('mouseup', pathEndHandler);
    canvas.addEventListener('touchend', pathEndHandler);
})
