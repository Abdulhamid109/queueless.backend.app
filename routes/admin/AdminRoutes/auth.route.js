import express from "express";
import { AdminChangePasswordController, AdminForgotPasswordController, AdminLoginController, AdminPreSignupController, AdminSignupController, AdminValidateOTPController } from "../AdminControllers/auth.controller.js";

const Adminrouter = express.Router();


Adminrouter.post('/login',AdminLoginController);
Adminrouter.post('/signup',AdminSignupController);
Adminrouter.post("/presignup",AdminPreSignupController)
Adminrouter.post('/forgot-password',AdminForgotPasswordController)
Adminrouter.post("/validateOTP",AdminValidateOTPController);
Adminrouter.post("/changepassword",AdminChangePasswordController)
export default Adminrouter;