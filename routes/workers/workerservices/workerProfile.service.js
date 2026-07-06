import dbconnect from "../../../config/dbConfig.js"
import worker from "../../../models/workermodal.js";



dbconnect();
export const getWorkerProfileDetails =async(wid)=>{
    if(!wid){
        throw new Error("Worker id not found")
    }

    const workerdata = await worker.findById(wid);
    return workerdata;
}