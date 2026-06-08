import express from "express";
import { AdminLoginController, AdminSignupController } from "../AdminControllers/auth.controller.js";

const Adminrouter = express.Router();


Adminrouter.post('/login',AdminLoginController);
Adminrouter.post('/signup',AdminSignupController);

export default Adminrouter;