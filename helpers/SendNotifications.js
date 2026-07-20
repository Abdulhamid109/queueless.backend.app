import { messaging } from "../utils/firebaseAdmin.js";

export const sendPushNotification = async (fcmToken, title, body, data = {}) => {
    const message = {
        token: fcmToken,
        notification: { title, body },
        data,
    };
    return await messaging.send(message);
};