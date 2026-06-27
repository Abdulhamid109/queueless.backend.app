import { addtimeData, gettimeData, updateTimeData } from "../AdminServices/timeInfo.service.js";



export const addtimeInfo = async (req,res)=>{
    try {
        const {BusinessID,BST,BET,CustomerLimitPerDay,AdditionalInformation} = req.body;
        const status = await addtimeData(BusinessID,BST,BET,CustomerLimitPerDay,AdditionalInformation);
        return res.status(200).json(
            {success:true,status}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}

export const getTimeInfo = async(req,res)=>{
    try {
        const bid = req.params.bid;
        const data = await gettimeData(bid);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}

export const UpdateTimeController = async(req,res)=>{
    try {
        const tid = req.params.tid;
        const {BST,BET,CustomerLimitPerDay,AdditionalInformation} = req.body;
        const data = await updateTimeData(tid,BST,BET,CustomerLimitPerDay,AdditionalInformation);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}

