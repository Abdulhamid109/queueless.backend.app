import { getNotificationsService, updateAckNotification } from "../CustomerServices/notification.service.js";


export const getNotificationsController=async(req,res)=>{
    try {
        const uid = req.params.uid;
        const data = await getNotificationsService(uid);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal server error => "+error}
        )
    }

}

export const updateAckNotificationController = async(req,res)=>{
    try {
        const notificationid = req.params.nid;
        const data = await updateAckNotification(notificationid);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal server error => "+error}
        )
    }
}