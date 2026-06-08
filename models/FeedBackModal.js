import mongoose from "mongoose";

const FeedBackModal = new mongoose.Schema({
    bid:{
        type:String
    },
    cid:{
        type:String
    },
    Title:{
        type:String,
        required:true
    },
    Description:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const FeedBack = mongoose.models.feedback || mongoose.model('feedback',FeedBackModal);
export default FeedBack;