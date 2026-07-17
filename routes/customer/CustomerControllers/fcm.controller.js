import { UpdateFCMTokenService } from "../CustomerServices/fcm.service.js";


export const UpdateFCMToken =async(req,res)=>{
    try {
        const uid = req.params.uid;
        const {fcmToken} = req.body;
        const data = await UpdateFCMTokenService(uid,fcmToken);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return resizeBy.status(500).json(
            {error:"Internal server error"+error}
        )
    }
}