import { joinQueueService } from "../CustomerServices/queue.service.js";


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