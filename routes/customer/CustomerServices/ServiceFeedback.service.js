import dbconnect from "../../../config/dbConfig.js";
import FeedBack from "../../../models/FeedBackModal.js";


dbconnect();

export const addServiceFeedbackData=async(bid,cid,Title,Description)=>{
    if(!bid || !cid){
        throw new Error("Something went wrong!(cid &bid not found)")
    }
    if(!Title || !Description){
         throw new Error("Empty values")
    }
    const newServiceFeedback = new FeedBack({
        bid,
        cid,
        Title,
        Description
    });
    const savedServiceFeedback = await newServiceFeedback.save();
}