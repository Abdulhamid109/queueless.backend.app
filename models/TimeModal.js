import mongoose from "mongoose";

const TimeModalSchema = new mongoose.Schema({
    BusinessID: {
        type: String
    },
    BST: {
        type: String
    },
    BET: {
        type: String
    },
    CustomerLimitPerDay: {
        type: Number
    },
    AdditionalInformation: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BusinessTime = mongoose.models.businesstime || mongoose.model('businesstime', TimeModalSchema);
export default BusinessTime;