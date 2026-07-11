import { getWorkerProfileDetails } from "../workerservices/workerProfile.service.js";


export const workerProfileController =async(req,res)=>{
    try {
        const wid = req.params.wid;
        const data = await getWorkerProfileDetails(wid);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"}
        )
    }
}