const cookieParser = require('cookie-parser');
const express = require('express');
const connectdb = require('./config/mongoose.js');
const client = require('./config/redis.js');
const app = express();
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const backgroundjob = require('./controllers/anotherline.js')
require('dotenv').config();


app.use(cors({
  origin: "http://localhost:5173",   // explicitly allow your frontend
  credentials: true                  // allow cookies/auth headers
}));
app.use( express.json());
app.use(cookieParser())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  
    credentials: true                 
  }
});

// 👇 make io available globally (simple way)
app.set("io", io);

io.on("connection" , (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const authroutes = require('./routers/account.routers.js');

app.use("/api/auth" , authroutes);
const dashboardroutes = require('./routers/dashboard.routers.js')
app.use('/api/dashboard' ,  dashboardroutes);
const machinesroutes = require('./routers/machines.routers.js')
app.use('/api/machines' , machinesroutes)
const alarmrouters = require('./routers/alarm.routers.js')
app.use('/api/alarms' , alarmrouters)
async function connections(){

    try{

        await client.connect();
        console.log('connect to redis db')

        await connectdb();
         console.log(' connected to db');

         const port = process.env.Port;
         server.listen(port, () => {
           console.log(`Server running on port ${port}`);

            setTimeout(async () => {
              try {
                await backgroundjob();
              } catch (err) {
                console.error(err);
              }
            }, 5000);
});
    }catch(err){
    console.log('Error : ' + err);
    }
}
connections();

/**
 * 
 * import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: '',
    socket: {
        host: '',
        port:
    }
});

client.on('error', err => console.log('Redis Client Error', err));
 */