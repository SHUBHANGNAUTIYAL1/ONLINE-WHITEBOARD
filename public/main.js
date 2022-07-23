let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let start_bgColor = "white";


//ctx.fillStyle = start_bgColor;
//ctx.fillRect(0, 0, canvas.width, canvas.height);


let draw_color = "black";
let draw_width = "2";
let is_drawing = false;
let restore_array = [];
let index = -1;

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);


canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

var io = io.connect("https://whiteboard102.herokuapp.com/");
//var io = io.connect("http://localhost:8080/");
function change_color(element) {
    draw_color = element.value;
    console.log(draw_color);
    io.emit("color",{draw_color});
}
function updateColor(){
    io.emit("color",{draw_color});
}
function updateWidth(){
    io.emit("width",{draw_width});
}

function start(event) {
    let x = event.clientX - canvas.offsetLeft;
    let y =  event.clientY - canvas.offsetTop;
    io.emit("start",{x,y});
}

function draw(event) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    //console.log(event)
    io.emit("draw",{ x , y});

}

function stop(event) {
    var val = event.type != onmouseout;
    //console.log(val);
    io.emit("stop",{val});
}

function clear_canvas() {
    io.emit("clear");
}

function undo_last(){
    io.emit("undo");
}

//   Receiving function calls

//          clear whiteboard

io.on("clear",()=>{
    ctx.fillStyle = start_bgColor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    restore_array = [];
    index= -1;
})


//          change Color
io.on("color",({color}) => {
    //console.log(color.draw_color);
    draw_color = color.draw_color;
})


//          Change width
io.on("width",({width}) => {
    console.log(width.draw_width);
    draw_width = width.draw_width;
    
})

//          UNDO

io.on("undo",() =>{
    console.log(index);
    if(index <= 0){
        // console.log("called if") ;
        clear_canvas();
    }
    else{
        // console.log("called else") ;
        index -= 1;
        restore_array.pop();
        ctx.putImageData(restore_array[index] , 0 , 0);
    }
})

//          start
io.on("start",({x,y}) => {
    //console.log("start");
    is_drawing = true;
    ctx.beginPath();
    ctx.moveTo(x,y);
    // event.preventDefault();
})

//          stop
io.on("stop",({event}) => {
    //console.log(event.val);
    if (event.val && is_drawing) {
        restore_array.push(ctx.getImageData( 0, 0, canvas.width, canvas.height));
        index++;
    }
    if (is_drawing) {
        ctx.stroke();
        ctx.closePath();
        is_drawing = false;
    }
   // console.log(restore_array)
    // event.preventDefault();
})

//          draw
io.on("draw",({x,y})=>{
    //console.log(e);
    if (is_drawing) {
        ctx.lineTo(x,y);
        ctx.strokeStyle = draw_color;
        ctx.lineWidth = draw_width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    }
    //  e.preventDefault();
})