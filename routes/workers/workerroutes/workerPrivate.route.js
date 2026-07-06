import express from "express";
import { QueueBookingController, updateWorkerStatusController } from "../workercontroller/workerQueue.controller.js";
import { workerProfileController } from "../workercontroller/workerProfile.controller.js";


const PrivateWorkerRouter = express.Router();

PrivateWorkerRouter.get("/getProfile/:wid",workerProfileController);
PrivateWorkerRouter.put("/update-status/:wid",updateWorkerStatusController);
PrivateWorkerRouter.get("/getBookingsBasedOnDate/:wid",QueueBookingController);

export default PrivateWorkerRouter;