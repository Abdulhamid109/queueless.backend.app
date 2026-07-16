import dbconnect from "../../../config/dbConfig.js";
import notifications from "../../../models/NotificationModal.js";


dbconnect();

export const getNotificationsService =async(uid)=>{
    if(uid){
        throw new Error("Uid not found!");
    }
    const notificationsData = await notifications.find({"userid":uid});
    return notificationsData;
}

export const updateAckNotification = async(notificationID)=>{
    if(!notificationID){
        throw new Error("Uid not found!");
    }
    const updatedNotification = await notifications.findByIdAndUpdate(notificationID,{
        ackStatus:true
    })
}