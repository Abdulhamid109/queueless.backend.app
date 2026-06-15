import { updateLiveLocationService } from "../CustomerServices/livelocation.service.js";

export const UpdateLiveLocations =async(req,res)=>{
    try {
        const {latitude,longitude} = req.body;
        const status = await updateLiveLocationService(latitude,longitude);
        return res.status(200).json(
            {success:true,status}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal server error => "+error}
        )
    }
}