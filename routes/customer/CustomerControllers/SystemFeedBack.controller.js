import { addSystemFeedbackData } from "../CustomerServices/SystemFeedback.service.js";


export const addSystemFeedbackInfo =async(req,res)=>{
    try {
        const {Title,Description} = req.body;
        const status = await addSystemFeedbackData(Title,Description);
    } catch (error) {
        res.status(500).json(
            {error:"Internal Server error => "+error}
        )
    }
}