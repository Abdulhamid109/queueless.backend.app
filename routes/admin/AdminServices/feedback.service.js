import dbconnect from "../../../config/dbConfig.js";
import FeedBack from "../../../models/FeedBackModal.js";


dbconnect();

export const getBusinessFeedbacks = async(bid)=>{
    if(!bid){
        throw new Error("Invalid BID or BID not Found");
    }
    const feedbackDB = await FeedBack.find({bid});
    return feedbackDB;
}