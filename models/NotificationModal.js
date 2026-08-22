import mongoose from "mongoose";

const notificationModal = mongoose.Schema({
    userid:{
        type:String
    },
    businessid:{
        type:String
    },
    title:{
        type:String,
    },
    body:{
        type:String,
    },
    queueID:{
        type:String
    },
    ackStatus: {
    type: String,
    enum: ["pending", "comming", "notcomming"],
    default: "pending"
},
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const notifications = mongoose.models.notification || mongoose.model("notification",notificationModal);
export default notifications;