import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import {readFileSync} from "fs";


const serviceAccount = JSON.parse(
    readFileSync(new URL("/etc/secrets/queueless-fcm-03403f00cac1.json", import.meta.url))
);

const app = admin.initializeApp({
    credential: admin.cert(serviceAccount)
})


export const messaging = getMessaging(app);

