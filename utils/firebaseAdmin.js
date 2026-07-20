import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import {readFileSync} from "fs";


const serviceAccount = JSON.parse(
    readFileSync(new URL("/etc/secrets/queueless-fcm-4eebf9a1bb57.json", import.meta.url))
);

const app = admin.initializeApp({
    credential: admin.cert(serviceAccount)
})


export const messaging = getMessaging(app);

