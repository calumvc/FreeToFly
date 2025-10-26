
window.addEventListener("DOMContentLoaded", (e) => {
    const canvas = document.getElementById('canvasPath');
    const ctx = canvas.getContext('2d');
    var record = [];
    var flag = 0;
    var firstDraw = 0; //get rid of random line from top left
    var lastposition = [0, 0];
    //pathsDic[pathcount(id)][0 for dot records and 1 for drawing][separate records]
    // var pathcount = 0;
    var currentPath = [];


    function singleRecord(event, record) {
        var x = event.clientX;
        var y = event.clientY;
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
    currentX = event.clientX;
    currentY = event.clientY;
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
        ctx.arc(x, y, 2, 0, 2 * Math.PI); // 2 is the radius in case you wanna change
        ctx.fill();
        ctx.closePath();
        currentPath.push(["dot", x, y, 2, 0, 2 * Math.PI]);
    }

    function pathComplete(index) {
        delete pathsDic(index);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawValidPath();
    }

    function addValidPath() {
        pathsDic[pathcount].push(record);
        pathsDic[pathcount].push(currentPath);
    }

    // function drawValidPath(){
    //     for (let i = 0; i<pathcount; i++){
    //         for (let j =0; j<length(pathsDic[pathcount]);j++){
    //             if (pathsDic[i][1][j][0]=="line"){
    //                 ctx.beginPath();
    //                 ctx.moveTo(pathsDic[i][1][j][1],pathsDic[i][1][j][2]);
    //                 ctx.lineTo(pathsDic[i][1][j][3],pathsDic[i][1][j][4]); ctx.stroke(); ctx.closePath();
    //             } else if (pathsDic[i][1][j][0]=="dot"){
    //                 ctx.beginPath();
    //                 ctx.fillStyle = "grey";
    //                 ctx.arc(pathsDic[i][1][j][1],pathsDic[i][1][j][2],pathsDic[i][1][j][3],pathsDic[i][1][j][4],pathsDic[i][1][j][5]);
    //                 ctx.fill();
    //                 ctx.closePath();
    //             }
    //         }
    //     }
    // }

    canvas.addEventListener('mousedown', (e) => {
        flag = 1;
        pathsDic[pathcount] = []
    });
    canvas.addEventListener('mousemove', (e) => {
        if (flag == 1) {
            if (compareDistance(e, lastposition) == 1) {
                singleRecord(e, record);
            }
        }
    })
    canvas.addEventListener('mouseup', (e) => {
        flag = 0;
        firstDraw = 0;
        record = [];
        // console.log(currentPath);
        addValidPath();
        // console.log(pathsDic[pathcount]);
        currentPath = [];
        pathcount++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawValidPath();
})
})
