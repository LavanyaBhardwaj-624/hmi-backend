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

const helmet = require('helmet');
app.use(helmet());

const frontend_url = process.env.Frontend_Url
app.use(cors({
  origin: frontend_url,
  credentials: true                  
}));
app.use( express.json());
app.use(cookieParser())

const server = http.createServer(app)


const io = new Server(server, {
  cors: {
    origin: frontend_url,  
    credentials: true                 
  }
});

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
app.use('/api/machines' , machinesroutes);

const alarmrouters = require('./routers/alarm.routers.js')
app.use('/api/alarms' , alarmrouters)

const profileRoutes = require('./routers/profile.router.js');
app.use('/api/profiles' , profileRoutes);


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

