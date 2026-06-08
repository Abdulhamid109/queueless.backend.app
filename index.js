import express from "express";
import cors from "cors"
import { configDotenv } from "dotenv";
import {MaincustomerRouter,Adminrouter, GenCustomerRouter, PrivateAdminRouter} from "./routes/index.js";


configDotenv()
const app = express();
app.use(cors({origin:'*'}))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/admin/auth/",Adminrouter)
app.use("/customer/auth/",MaincustomerRouter)
app.use("/customer/",GenCustomerRouter)
app.use("/admin",PrivateAdminRouter);






app.listen((process.env.PORT||3000), "0.0.0.0",(req,res)=>{
    console.log(`Server started at the port ${process.env.PORT}`)
})