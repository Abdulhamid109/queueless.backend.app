import { CustomerLogin,CustomerSignup } from "../CustomerControllers/auth.controller.js";
import express from "express"

const MaincustomerRouter = express.Router();



//Auth Routes
MaincustomerRouter.post("/Login",CustomerLogin);
MaincustomerRouter.post("/signup",CustomerSignup);


export default MaincustomerRouter;


