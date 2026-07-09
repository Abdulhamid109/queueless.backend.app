import { exitQueueService, joinQueueService, QueueCountService, UpdatedQueueDataService } from "../CustomerServices/queue.service.js";


export const joinQueueController =async(req,res)=>{
    try {
        const bid = req.params.bid;
        const uid = req.params.uid;
        console.log("joinQueue -bid cont "+bid)
        console.log("joinQueue -uid cont "+uid)
        const {serviceIds} = req.body;

        const data = await joinQueueService(serviceIds,bid,uid);
        return res.status(200).json(
            {success:true,data}
        )
        
    } catch (error) {
        console.log("error => "+JSON.stringify(error));
        return res.status(500).json(
            {error:"Internal Server error "+ error}
        )
    }
}


export const QueueCountController =async(req,res)=>{
    try {
        // const {QueueCount,bid} = req.body;
        console.log("🔍 Full params object:", req.params);
        console.log("🔍 Full URL:", req.originalUrl);
        const bid = req.params.bid;
        const uid = req.params.uid;
        console.log("BID => "+bid);
        console.log("UID => "+uid);
       const data =  await QueueCountService(bid,uid);
        return res.status(200).json(
            {success:true,data}
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

export const exitQueueController = async(req,res)=>{
    try {
        const bid = await req.params.bid;
        const uid = await req.params.uid;
        const data = await exitQueueService(bid,uid);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Serve error "+error}
        )
    }
}