// here we will be defining all the private routes
import express from "express";
import { addbusinessInfo, getBusinessBasedOnId, getBusinessInfo, updateBusinessData } from "../AdminControllers/businessInfo.controller.js";
import { addworkerInfo, getSingleWorkerController, getWorkerData, updateWorkerController } from "../AdminControllers/workerInfo.controller.js";
import { addServiceInfo, getServiceInfo, getSingleServiceController, updateServiceController } from "../AdminControllers/serviceInfo.controller.js";
import { addtimeInfo, getTimeInfo, UpdateTimeController } from "../AdminControllers/timeInfo.controller.js";
import { getAdminProfileInfo } from "../AdminControllers/adminProfile.controller.js";

const PrivateAdminRouter = express.Router();

PrivateAdminRouter.post("/addbusinessInfo",addbusinessInfo);
PrivateAdminRouter.post("/addworkerInfo",addworkerInfo);
PrivateAdminRouter.post("/addserviceInfo",addServiceInfo)
PrivateAdminRouter.post("/addtimeInfo",addtimeInfo);
PrivateAdminRouter.get("/getBusinessData/:adminid",getBusinessInfo);
PrivateAdminRouter.get("/getBusiness/:bid",getBusinessBasedOnId);
PrivateAdminRouter.get("/getWorkerData/:businessid",getWorkerData);
PrivateAdminRouter.get("/getSingleWorkerData/:wid",getSingleWorkerController);
PrivateAdminRouter.get("/getTimeData/:bid",getTimeInfo);
PrivateAdminRouter.get("/getServiceData/:bid",getServiceInfo);
PrivateAdminRouter.get("/getSingleService/:serviceID",getSingleServiceController);
PrivateAdminRouter.get("/adminProfile/:adminId",getAdminProfileInfo);

PrivateAdminRouter.put("/updateBusinessData/:adminid/:bid",updateBusinessData);
PrivateAdminRouter.put("/updateServiceData/:serviceID",updateServiceController);
PrivateAdminRouter.put("/updateWorkerData/:wid",updateWorkerController);
PrivateAdminRouter.put("/updateTimeData/:tid",UpdateTimeController);


export default PrivateAdminRouter;