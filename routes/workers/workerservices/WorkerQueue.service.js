import dbconnect from "../../../config/dbConfig.js";
import customer from "../../../models/CustomerModal.js";
import queue from "../../../models/QueueModal.js";
import worker from "../../../models/workermodal.js";



dbconnect()
export const updateWorkerStatusService = async (wid,status)=>{
    if(!wid){
        throw new Error("Workerid not found");
    }
    const updatedWorker  = await worker.findByIdAndUpdate(wid,{
        "WorkStatus":status
    });

    return updatedWorker;
}

// export const QueueBookingService = async (wid, date) => {

//     if (!wid) {
//         throw new Error("WorkerId not found");
//     }

//     if (!date) {
//         throw new Error("Date not found!");
//     }

//     const WorkerData = await worker.findById(wid);

//     const queuelist = await Promise.all(
//         WorkerData.queueInfo.map(async (data) => {

//             const QueueData = await queue.findById(data.queueID);

//             const userData = await customer.findById(QueueData.UserId);

//             return {
//                 name: userData.name,
//                 position: data.position,
//             };
//         })
//     );

//     return queuelist;
// };

export const workerBookingCountService =async(wid, date) =>{
    
    if (!wid) {
        throw new Error("WorkerId not found");
    }

    if (!date) {
        throw new Error("Date not found!");
    }

    const WorkerData = await worker.findById(wid);

    const queuelist = await Promise.all(
        WorkerData.queueInfo.map(async (data) => {

            const QueueData = await queue.findById(data.queueID);

            const userData = await customer.findById(QueueData.UserId);

            return {
                name: userData.name,
                position: data.position,
                joinedQueue: QueueData.JoinedQueue
            };
        })
    );

    console.log("QueueList"+queuelist);

    return queuelist;
}