import { joinQueueService, QueueCountService, UpdatedQueueDataService } from "../CustomerServices/queue.service.js";


export const joinQueueController =async(req,res)=>{
    try {
        const bid = req.params.bid;
        const uid = req.params.uid;

        const {serviceIds} = req.body;

        const data = await joinQueueService(serviceIds,bid,uid);
        return res.status(200).json(
            {success:true,data}
        )
        
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error "+error}
        )
    }
}


export const QueueCountController =async(req,res)=>{
    try {
        // const {QueueCount,bid} = req.body;
        const bid = await req.params.bid;
        await QueueCountService(bid);
        return res.status(200).json(
            {success:true}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error "+error}
        )
    }
}

export const updatedQueueDataController = async(req,res)=>{
    try {
        const {UpdatedExpectedStartTime,CurrentPostion,uid} = req.body;
        await UpdatedQueueDataService(UpdatedExpectedStartTime,CurrentPostion,uid);
        return res.status(200).json(
            {success:true}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error "+error}
        )
    }
}