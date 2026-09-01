// here we will be defining all the private routes
import express from "express";
import { addbusinessInfo, deletebusinessController, getBusinessBasedOnId, getBusinessInfo, updateBusinessData } from "../AdminControllers/businessInfo.controller.js";
import { addworkerInfo, getSingleWorkerController, getWorkerData, updateWorkerController } from "../AdminControllers/workerInfo.controller.js";
import { addServiceInfo, getServiceInfo, getSingleServiceController, updateServiceController } from "../AdminControllers/serviceInfo.controller.js";
import { addtimeInfo, getTimeInfo, UpdateTimeController } from "../AdminControllers/timeInfo.controller.js";
import { getAdminProfileInfo } from "../AdminControllers/adminProfile.controller.js";
import { CustomExpenseController, DailyExpenseController, OverallExpenseController } from "../AdminControllers/expense.controller.js";
import { BusinessFeedbackController } from "../AdminControllers/feedback.controller.js";
import multer from "multer";
// import { liveQueueController } from "../AdminControllers/adminqueue.controller.js";

const PrivateAdminRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|pdf/;
        const ok = allowed.test(file.mimetype);
        cb(ok ? null : new Error('Unsupported file type'), ok);
    }
})

PrivateAdminRouter.post("/addbusinessInfo",upload.single('file'), addbusinessInfo);
PrivateAdminRouter.post("/addworkerInfo", addworkerInfo);
PrivateAdminRouter.post("/addserviceInfo", addServiceInfo)
PrivateAdminRouter.post("/addtimeInfo", addtimeInfo);
PrivateAdminRouter.get("/getBusinessData/:adminid", getBusinessInfo);
PrivateAdminRouter.get("/getBusiness/:bid", getBusinessBasedOnId);
PrivateAdminRouter.get("/getWorkerData/:businessid", getWorkerData);
PrivateAdminRouter.get("/getSingleWorkerData/:wid", getSingleWorkerController);
PrivateAdminRouter.get("/getTimeData/:bid", getTimeInfo);
PrivateAdminRouter.get("/getServiceData/:bid", getServiceInfo);
PrivateAdminRouter.get("/getSingleService/:serviceID", getSingleServiceController);
PrivateAdminRouter.get("/adminProfile/:adminId", getAdminProfileInfo);

PrivateAdminRouter.put("/updateBusinessData/:adminid/:bid", updateBusinessData);
PrivateAdminRouter.put("/updateServiceData/:serviceID", updateServiceController);
PrivateAdminRouter.put("/updateWorkerData/:wid", updateWorkerController);
PrivateAdminRouter.put("/updateTimeData/:tid", UpdateTimeController);

PrivateAdminRouter.get("/dailyexpense/:aid/:bid", DailyExpenseController);
PrivateAdminRouter.get("/overallexpense/:aid/:bid", OverallExpenseController);
PrivateAdminRouter.get("/customexpense/:aid/:bid", CustomExpenseController);

PrivateAdminRouter.get("/Businessfeedbacks/:bid", BusinessFeedbackController);
// PrivateAdminRouter.get("/livequeuemembers/:bid", liveQueueController);

PrivateAdminRouter.delete("/deletebusiness/:bid",deletebusinessController);



export default PrivateAdminRouter;