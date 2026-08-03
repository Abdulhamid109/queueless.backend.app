import express from "express";
import { GetCustomerProfileDataController } from "../CustomerControllers/Profile.controller.js";
import { GetBusinessBasedOnCat, GetBusinessBasedonRad } from "../CustomerControllers/BusinessBasedOnCat.controller.js";
import { addSystemFeedbackInfo } from "../CustomerControllers/SystemFeedBack.controller.js";
import { addServiceFeedbackInfo } from "../CustomerControllers/serviceFeedback.controller.js";
import { DirectQueueRemovalController, 
    exitQueueController, 
    joinQueueController,
    QueueCountController, 
    updatedQueueDataController } from "../CustomerControllers/queue.controller.js";
import { UpdateLiveLocations } from "../CustomerControllers/livelocation.controller.js";
import { getNotificationsController, updateAckNotificationController } from "../CustomerControllers/notifications.controller.js";
import { UpdateFCMToken } from "../CustomerControllers/fcm.controller.js";

const GenCustomerRouter = express.Router();


//All Private/Non-auth Routes
GenCustomerRouter.get("/profile/:id",GetCustomerProfileDataController);
GenCustomerRouter.post("/getBusinessBasedOnCat/:slug",GetBusinessBasedOnCat);
GenCustomerRouter.post("/addSystemFeedback",addSystemFeedbackInfo);
GenCustomerRouter.post("/addServiceFeedback/:bid/:cid",addServiceFeedbackInfo);
GenCustomerRouter.post("/joinQueue/:bid/:uid",joinQueueController);
GenCustomerRouter.post("/getLiveLocation/:uid",UpdateLiveLocations);
GenCustomerRouter.get("/getTotalQueueCount/:bid/:uid",QueueCountController);
// GenCustomerRouter.post("/getUpdatedQueueCount/:bid",UpdatedQueueCountController);
GenCustomerRouter.post("/update QueueData",updatedQueueDataController);
GenCustomerRouter.delete("/exitQueue/:bid/:uid",exitQueueController);
GenCustomerRouter.delete("/DirectQueueExit/:qid",DirectQueueRemovalController);
GenCustomerRouter.get("/getNotifications/:uid",getNotificationsController);
GenCustomerRouter.put("/updateAckStatus/:nid",updateAckNotificationController);
GenCustomerRouter.put("/updateFCM/:uid",UpdateFCMToken);
GenCustomerRouter.post("/getBusinessBasedonRad/:slug",GetBusinessBasedonRad);

export default GenCustomerRouter;