// this feedback model will be displayed for the customers who want to give feedback for the application

import mongoose from "mongoose"

const SystemFeedbackModal = new mongoose.Schema({
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

const SfeedBack = await mongoose.models.systemfeedbacks || mongoose.model('systemfeedbacks',SystemFeedbackModal);
export default SfeedBack;