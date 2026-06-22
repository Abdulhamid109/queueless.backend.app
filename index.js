import express from "express";
import cors from "cors"
import { configDotenv } from "dotenv";
import {MaincustomerRouter,Adminrouter, GenCustomerRouter, PrivateAdminRouter} from "./routes/index.js";
import { inngestClient } from "./utils/inngest/inngestClient.js";
// import { functions }: from "./utils/inngest/expFun.js";
import { serve } from "inngest/express";
import { AfterJoinWork } from "./utils/inngest/functions/afterJoinQueueArch.js";
import { RebalanceQueue } from "./utils/inngest/functions/rebalancingQueue.js";
import http from "http";
import { Server } from "socket.io";
import { intializeSocketConnection } from "./utils/socket.js";


configDotenv()
const app = express();
app.use(cors({origin:'*'}))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/admin/auth/",Adminrouter)
app.use("/customer/auth/",MaincustomerRouter)
app.use("/customer/",GenCustomerRouter)
app.use("/admin",PrivateAdminRouter);
app.use("/api/inngest", serve({ client: inngestClient, functions:[AfterJoinWork,RebalanceQueue] }));


const wss = http.createServer(app);

const io = new Server(wss);

intializeSocketConnection(io);




wss.listen((process.env.PORT||3000), "0.0.0.0",(req,res)=>{
    console.log(`Server started at the port ${process.env.PORT}`)
})