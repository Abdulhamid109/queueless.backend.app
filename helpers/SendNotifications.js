import admin from "../utils/firebaseAdmin.js";

export const sendPushNotification = async (fcmToken, title, body, data = {}) => {
    const message = {
        token: fcmToken,
        notification: { title, body },
        data,
    };
    return await admin.messaging().send(message);
};