import mongoose from "mongoose"


const WorkerModal = new mongoose.Schema({
    workerName: {
        type: String
    },
    WorkerEmail: {
        type: String,
        unique: true
    },
    WorkStatus: {
        type: String,
        enum: ["active", "inactive"], //(to check whether the worker is active or not)
        default: "inactive"
    },
    adminId: {
        type: String
    },
    businessId: {
        type: String
    },

});

const worker = mongoose.models.workers || mongoose.model('workers', WorkerModal);
export default worker;