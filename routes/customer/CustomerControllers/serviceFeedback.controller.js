import { addServiceFeedbackData } from "../CustomerServices/ServiceFeedback.service.js";


export const addServiceFeedbackInfo=async(req,res)=>{
    try {
        const bid = req.params.bid;
        const cid = req.params.cid;
        const {Title,Description} = req.body;
        const status = await addServiceFeedbackData(bid,cid,Title,Description);
        return res.status(200).json(
            {success:true,status}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}