

export const liveQueueController =async(req,res)=>{
    try {
        const bid = req.params.bid;
        const result = await liveQueueService(bid);
        return res.status(200).json(
            {data:result , status:true}
        )
    } catch (error) {
        return res.status(500).json(
            {error:error},
        )
    }
}