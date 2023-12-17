const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

var position = {

}

Socketio.on("connection", socket => {
    socket.emit("postion", position);
})

Http.listen(3000, ()=> {
    console.log("Listen at 3000:")
})