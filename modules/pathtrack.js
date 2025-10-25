const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var record = [];
var flag = 0;
var lastposition = [0,0];

function singleRecord(event,record){
    var x = event.clientX;
    var y = event.clientY;
    record.push([x,y]);
    lastposition = [x,y];
    console.log("position recorded"+lastposition);
    draw(x,y);
}

function compareDistance(event,lastpos){ //only record after some distance moved
  currentX = event.clientX;
  currentY = event.clientY;
  lastX = lastpos[0];
  lastY = lastpos[1];
  if ((currentX - lastX)**2 + (currentY - lastY)**2 > 800){ // modify the number to determine the distance between path dots
    return 1;
  }else {
    return 0;
  }
}

function draw(x,y){
    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.arc(x,y,3,0,2*Math.PI); //3 is the radius in case you wanna change
    ctx.fill();
    ctx.closePath();
}

canvas.addEventListener('mousedown', (e) =>{
  flag = 1;
});
canvas.addEventListener('mousemove', (e) =>{
  if (flag == 1){
    if (compareDistance(e,lastposition) == 1){
      singleRecord(e,record);
    }
  }
})
canvas.addEventListener('mouseup',(e)=>{
  flag = 0;
  console.log("mouse position recorded"+record);
  record=[];
  console.log("mouse position cleared");
})