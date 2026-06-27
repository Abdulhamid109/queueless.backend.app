import { addbusinessData } from "../AdminServices/businessInfo.service.js";
import { addworkerData, getServiceWorkerData, getSingleWorker, updateWorker } from "../AdminServices/workerInfo.service.js";


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
        console.log("Worker Data C=>"+data)
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}

export const getSingleWorkerController = async(req,res)=>{
    try {
        const wid = req.params.wid;
        const data = await getSingleWorker(wid);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}

export const updateWorkerController =async(req,res)=>{
    try {
        const wid = req.params.wid;
        const {workerName,WorkerEmail} = req.body;
        const data = await updateWorker(wid,workerName,WorkerEmail);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}