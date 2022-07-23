let express = require("express");
let app = express();
 
let httpServer = require("http").createServer(app);
let io = require("socket.io")(httpServer);

let connections = [];


io.on("connect",(socket)=>{
    connections.push(socket);
    
    console.log(`${socket.id} has connected`);
   

    socket.on("draw",(data)=>{
        connections.forEach(con =>{
           // console.log(data.event);
                con.emit("draw",{x : data.x , y : data.y });
        })
    })

    socket.on("clear",() => {
        connections.forEach(con => {
            con.emit("clear");
        })
    })
    socket.on("undo",() => {
        connections.forEach(con => {
            con.emit("undo");
        })
    })

    socket.on("color",(data) => {
        connections.forEach(con =>{
                //console.log(data);
                con.emit("color",{color : data});
        })
    })
    socket.on("width",(data) => {
        connections.forEach(con =>{
                con.emit("width",{width : data});
        })
    })
    socket.on("start",(data) => {
        connections.forEach(con =>{
                con.emit("start",{x : data.x,y:data.y});
        })
    })
    socket.on("stop",(data) => {
        connections.forEach(con =>{
                //console.log(data.val)
                con.emit("stop",{event:data});
        })
    })



    socket.on("disconnect",(reason)=>{
        console.log(`${socket.id} has disconnected`);
        
            connections = connections.filter((conn)=>{
            
                conn.id != socket.id

     
        })
       
        
    })
    
})


app.use(express.static("public")); 



let PORT =  process.env.PORT || 8080;
httpServer.listen(PORT,()=>{console.log(`Server started on port : ${PORT}`)})