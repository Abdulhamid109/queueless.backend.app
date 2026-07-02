import express from "express";
import { workerAuthController } from "../workercontroller/workerauth.controller.js";


const WorkerAuthRouter = express.Router();

WorkerAuthRouter.post("/worker-login",workerAuthController);

export default WorkerAuthRouter;
