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
        throw new Error("No workers Associated with this business")
    }
    
    const workersData = await worker.find({businessId:businessId});
    console.log("workers => "+workersData);
    //sending the count based on date
    const now = new Date();
    const date = now.toLocaleDateString("en-US");
    const result = workersData.map((worker) => {
            const queueCount = worker.queueInfo.filter(
                (queue) => queue.date === date
            ).length;

            return {
                workerId: worker._id,
                workerName: worker.workerName,
                queueCount,
                status:worker.WorkStatus
            };
        });
    return result;
}

export const getSingleWorker = async(wid)=>{
    if(!wid){
        throw new Error("No workers Associated with this business");
    }
    const workerData = await worker.findById(wid);
    return workerData;
}

export const updateWorker = async (wid,workerName,WorkerEmail) =>{
    if(!wid){
        throw new Error("Invalid worker id");
    }

    const updatedWorkerInfo = await worker.findByIdAndUpdate(wid,{
        workerName,
        WorkerEmail
    });

    return updatedWorkerInfo;
}

