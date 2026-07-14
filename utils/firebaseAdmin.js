import admin from "firebase-admin";
import {readFileSync} from "fs";


const serviceAccount = JSON.parse(
    readFileSync(new URL("queueless-fcm-firebase-adminsdk-fbsvc-34f749eadb.json", import.meta.url))
);

admin.initializeApp({
    credential: admin.cert(serviceAccount)
})


export default admin;

