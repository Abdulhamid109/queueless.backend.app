import { getBusinessFeedbacks } from "../AdminServices/feedback.service.js";


export const BusinessFeedbackController = async(req,res)=>{
    try {
        const bid = req.params.bid;
        const data = await getBusinessFeedbacks(bid);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}