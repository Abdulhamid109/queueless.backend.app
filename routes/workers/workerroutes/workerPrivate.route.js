import express from "express";
import { allQueueMemberController } from "../workercontroller/workerQueue.controller.js";


const PrivateWorkerRouter = express.Router();

PrivateWorkerRouter.post("/getAllMembersFromQueue/:date",allQueueMemberController);

export default PrivateWorkerRouter;