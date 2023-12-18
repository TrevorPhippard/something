const app = require('express')();
// const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors')
const jwt = require('jsonwebtoken');


require('dotenv').config();

// jwt secret
const JWT_SECRET = process.env.JWT_SECRET ;
const SESSION_SECRET = '23';


/** ---------------------------------------------------------------------------
 *  @request_configurations
 * --------------------------------------------------------------------------- */

const corsOptions = {
  credentials: true,
  origin: ['*']
};
// app.options('*', cors());

app.use(cors())

// app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 


// Session middleware

// app.use(session({
//   secret: SESSION_SECRET,
//   resave: true,
//   saveUninitialized: true
// }));

// app.use(cookieParser(SESSION_SECRET));



/** ---------------------------------------------------------------------------
 *  @Routes
 * --------------------------------------------------------------------------- */

const routes = require('./api/routes/userRoutes');

routes(app);
app.use(function (req, res) {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  });
});


/** ---------------------------------------------------------------------------
 *  @Sockets
 * --------------------------------------------------------------------------- */

const socketServer = require('http').createServer(app);

const io = require("socket.io")(socketServer, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
  });
  
io.use(async (socket, next) => {
    // fetch token from handshake auth sent by FE
    const token = socket.handshake.auth.token;

    console.log('token:',token, JWT_SECRET)
    try {
      // verify jwt token and get user data
      const user = await jwt.verify(token, JWT_SECRET);
      console.log('user', user);
      // save the user data into socket object, to be used further
      socket.user = user;
      next();
    } catch (e) {
      // if token is invalid, close connection
      console.log('error', e.message);
      return next(new Error(e.message));
    }
  });
  
  io.on('connection', (socket) => {
    // join user's own room
    socket.join(socket.user.id);
    socket.join('myRandomChatRoomId');
    // find user's all channels from the database and call join event on all of them.
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('my message', (msg) => {
      console.log('message: ' + msg);
      io.emit('my broadcast', `server: ${msg}`);
    });
  
    socket.on('join', (roomName) => {
      console.log('join: ' + roomName);
      socket.join(roomName);
    });
  
    socket.on('message', ({message, roomName}, callback) => {
      console.log('message: ' + message + ' in ' + roomName);
  
      // generate data to send to receivers
      const outgoingMessage = {
        name: socket.user.name,
        id: socket.user.id,
        message,
      };
      // send socket to all in room except sender
      socket.to(roomName).emit("message", outgoingMessage);
      callback({
        status: "ok"
      });
      // send to all including sender
      // io.to(roomName).emit('message', message);
    })
  });
  
 
  socketServer.listen(3001, () => {
    console.log('SOCKET listening on *:3001');
  });
  

/** ---------------------------------------------------------------------------
 *  @ports
 * --------------------------------------------------------------------------- */
// process.env.PORT ||
const port =  3000;
app.listen(port);
console.log('API started on: ' + port);
module.exports = app;