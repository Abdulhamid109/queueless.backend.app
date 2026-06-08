import { addbusinessData } from "../AdminServices/businessInfo.service.js";
import { addworkerData, getServiceWorkerData } from "../AdminServices/workerInfo.service.js";


export const addworkerInfo =async(req,res)=>{
    try {
        const {workerName,WorkerEmail,adminId,businessId} = req.body;
        const status = await addworkerData(workerName,WorkerEmail,adminId,businessId);
        return res.status(200).json(
            {success:true,status}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}

export const getWorkerData =async(req,res)=>{
    try {
        const bid = req.params.businessid;
        const data = await getServiceWorkerData(bid);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}