import { updateWorkerStatusService, workerBookingCountService } from "../workerservices/WorkerQueue.service.js";



export const updateWorkerStatusController = async(req,res)=>{
    try {
        const wid = req.params.wid;
        const {status} = req.body;
        const Resultstatus = await updateWorkerStatusService(wid,status);
        return res.status(200).json(
            {success:"true",Resultstatus}
        )


    } catch (error) {
        return res.status(500).json(
            {error:"Internal Service error"+error},
        )
    }
}

// export const QueueBookingController =async(req,res)=>{
//     try {
//         const wid = req.params.wid
//         const data = await QueueBookingService(wid);
//         return res.status(200).json(
//             {success:true,data}
//         )
//     } catch (error) {
//         return res.status(500).json(
//             {error:"Internal Service error"+error},
//         )
//     }
// }

export const workerBookingCount =async(req,res)=>{
    try {
        const wid = req.params.wid;
        const date = req.query.date;
        console.log("Demonstration check =>"+date,wid);
        const data = await workerBookingCountService(wid,date);
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Service error"+error},
        )
    }
}