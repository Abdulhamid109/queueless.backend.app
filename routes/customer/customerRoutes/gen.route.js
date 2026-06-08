import express from "express";
import { GetCustomerProfileDataController } from "../CustomerControllers/Profile.controller.js";
import { GetBusinessBasedOnCat } from "../CustomerControllers/BusinessBasedOnCat.controller.js";
import { addSystemFeedbackInfo } from "../CustomerControllers/SystemFeedBack.controller.js";
import { addServiceFeedbackInfo } from "../CustomerControllers/serviceFeedback.controller.js";

const GenCustomerRouter = express.Router();


//All Private/Non-auth Routes
GenCustomerRouter.get("/profile/:id",GetCustomerProfileDataController);
GenCustomerRouter.post("/getBusinessBasedOnCat/:slug",GetBusinessBasedOnCat);
GenCustomerRouter.post("/addSystemFeedback",addSystemFeedbackInfo);
GenCustomerRouter.post("/addServiceFeedback/:bid/:cid",addServiceFeedbackInfo)


export default GenCustomerRouter;