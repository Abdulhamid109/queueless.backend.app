import { CustomerLogin,CustomerSignup } from "../CustomerControllers/auth.controller.js";
import express from "express"
import { kmaController } from "../CustomerControllers/kma.controller.js";

const MaincustomerRouter = express.Router();



//Auth Routes
MaincustomerRouter.post("/Login",CustomerLogin);
MaincustomerRouter.post("/signup",CustomerSignup);


//temp-route
MaincustomerRouter.get("/keep-me-alive",kmaController)

export default MaincustomerRouter;


