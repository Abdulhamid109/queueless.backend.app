import dbconnect from "../../../config/dbConfig.js";
import worker from "../../../models/workermodal.js";


dbconnect();

export const addworkerData =async(workerName,WorkerEmail,adminId,businessId)=>{
    if(!adminId){
        throw new Error("Unauthorized Admin")
    }
    if(!workerName || !WorkerEmail){
        throw new Error("Empty values")
    }
    const newWorkerData = new worker({
        workerName,
        WorkerEmail,
        adminId,
        businessId
    });

    const savedWorker = await newWorkerData.save();
    return true; //this indicates the workerdata is successfully added
}

export const getServiceWorkerData = async(businessId)=>{
    if(!businessId){
        throw new Error("No business Associated")
    }
    const workersData = await worker.find({businessId:businessId});
    return workersData;
}