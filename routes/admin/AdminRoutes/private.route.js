// here we will be defining all the private routes
import express from "express";
import { addbusinessInfo, getBusinessBasedOnId, getBusinessInfo, updateBusinessData } from "../AdminControllers/businessInfo.controller.js";
import { addworkerInfo, getWorkerData } from "../AdminControllers/workerInfo.controller.js";
import { addServiceInfo, getServiceInfo } from "../AdminControllers/serviceInfo.controller.js";
import { addtimeInfo, getTimeInfo } from "../AdminControllers/timeInfo.controller.js";
import { getAdminProfileInfo } from "../AdminControllers/adminProfile.controller.js";

const PrivateAdminRouter = express.Router();

PrivateAdminRouter.post("/addbusinessInfo",addbusinessInfo);
PrivateAdminRouter.post("/addworkerInfo",addworkerInfo);
PrivateAdminRouter.post("/addserviceInfo",addServiceInfo)
PrivateAdminRouter.post("/addtimeInfo",addtimeInfo);
PrivateAdminRouter.get("/getBusinessData/:adminid",getBusinessInfo);
PrivateAdminRouter.get("/getBusiness/:bid",getBusinessBasedOnId);
PrivateAdminRouter.get("/getWorkerData/:businessid",getWorkerData);
PrivateAdminRouter.get("/getTimeData/:bid",getTimeInfo);
PrivateAdminRouter.get("/getServiceData/:bid",getServiceInfo);
PrivateAdminRouter.get("/adminProfile/:adminId",getAdminProfileInfo);
PrivateAdminRouter.put("/updateBusinessData/:adminid",updateBusinessData);


export default PrivateAdminRouter;