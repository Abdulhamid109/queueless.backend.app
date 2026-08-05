import { CustomerForgotPasswordController, CustomerLogin,CustomerPreSignupController,CustomerSignup, ValidateOTPController } from "../CustomerControllers/auth.controller.js";
import express from "express"
import { kmaController } from "../CustomerControllers/kma.controller.js";

const MaincustomerRouter = express.Router();



//Auth Routes
MaincustomerRouter.post("/Login",CustomerLogin);
MaincustomerRouter.post("/signup",CustomerSignup);
MaincustomerRouter.post("/presignup",CustomerPreSignupController);
MaincustomerRouter.post("/validateOTP",ValidateOTPController);
MaincustomerRouter.post("/forgot-password",CustomerForgotPasswordController)

//temp/health-route
MaincustomerRouter.get("/keep-me-alive",kmaController)

export default MaincustomerRouter;


