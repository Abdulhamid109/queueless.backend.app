import dbconnect from "../../../config/dbConfig.js";
import notifications from "../../../models/NotificationModal.js";


dbconnect();

export const getNotificationsService =async(uid)=>{
    if(!uid){
        throw new Error("Uid not found!");
    }
    const notificationsData = await notifications.find({"userid":uid}).sort({createdAt:-1});
    return notificationsData;
}

export const updateAckNotification = async(notificationID,status)=>{
    if(!notificationID){
        throw new Error("Uid not found!");
    }
    //need to check exipry check
    const updatedNotification = await notifications.findByIdAndUpdate(notificationID,{
        ackStatus:status
    });
    

    return updatedNotification;
}