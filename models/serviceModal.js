import mongoose from "mongoose";

// AvgDurationPerCustomer -> can be treated as service time
const ServiceModal = new mongoose.Schema({
    businessId:{
        type:String
    },
    name:{
        type:String
    },
    AvgDurationPerCustomer:{
        type:Number
    },
    ChargesPerService:{
        type:Number
    }
});

const service = mongoose.models.service || mongoose.model('service',ServiceModal);
export default service;