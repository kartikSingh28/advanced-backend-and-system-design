import {WebSocketServer,WebSocket} from "ws";//WebSocketServer is used to create it
//WebSocket  type for each connecte client socket

const wss= new WebSocketServer({port:8000});//creates object of WebSocket Server that listenes on port 8000
//clients will connect using ws://localhost:8000

wss.on("connection",(socket:WebSocket)=>{//runs every time a new client connect,socket represents one connected client

    console.log("User Connected");

    //send data to the client every 1 sec

    const intervalId=setInterval(()=>{

        socket.send("Current price of Solana is "+Math.random());//sever send to client
    },1000);

    //listen for messages sent by client

    socket.on("message",(message:Buffer)=>{// for the message s ent by cliet to server

        console.log("Client says:",message.toString());
    });


    socket.on("close",()=>{
        console.log("User Disconnected !");

        clearInterval(intervalId);
    });
});


