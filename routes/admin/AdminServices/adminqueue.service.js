import dbconnect from "../../../config/dbConfig.js";
import queue from "../../../models/QueueModal.js";

dbconnect();

export const liveQueueService =async(bid)=>{
    if(!bid){
        throw new Error("business not found");
    }

    const queuedb = await queue.find(); 
    return ;

}