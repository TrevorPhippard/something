const app = require('express')();
// const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors')
const jwt = require('jsonwebtoken');


require('dotenv').config();

// jwt secret
const JWT_SECRET = process.env.JWT_SECRET ;
const SESSION_SECRET = '23';
let userList = [];


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

require('./api/routes/userRoutes')(app);
require('./api/routes/chatRoutes')(app);
// require('./api/routes/socketListeners')(app);

app.use(function (req, res) {
  console.log(req.originalUrl)
  res.status(404).send({
    url: req.originalUrl + ' not found'
  });
});


/** ---------------------------------------------------------------------------
 *  @Sockets
 * --------------------------------------------------------------------------- */

const socketServer = require('http').createServer(app, userList);

const io = require("socket.io")(socketServer, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
  
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    // console.log('token:',token, JWT_SECRET)
    try {
      const user = await jwt.verify(token, JWT_SECRET);
      socket.user = user;
      next();
    } catch (e) {
      console.log('error', e.message);
      return next(new Error(e.message));
    }
  });
  
  io.on('connection', (socket) => require('./api/routes/socketIO.js')(io, socket, userList));

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