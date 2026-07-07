import { convertToMinutes } from "../../../helpers/MinsConversion.js";
import customer from "../../../models/CustomerModal.js";
import queue from "../../../models/QueueModal.js";
import service from "../../../models/serviceModal.js";
import BusinessTime from "../../../models/TimeModal.js";
import worker from "../../../models/workermodal.js";
import { inngestClient } from "../../../utils/inngest/inngestClient.js";
import { getIO } from "../../../utils/socket.js";



export const joinQueueService = async (serviceids, bid, uid) => {
    if (!uid) {
        throw "Unauthorized User"
    }
    const now = new Date();
    const Currentdate = now.toLocaleDateString();
    const io = getIO();

    //1.To check whether the user/customer is already enrolled in the queue
    const existingActiveQueue = await queue.findOne({
        UserId: uid,
        businessId:bid,
        QueueStatus: { $in: ["waiting", "in-progress"] }
    });

    if (existingActiveQueue) {
        throw "You're already in a queue. Please wait until it's completed before joining another.";
    }

    //2.timedetails & customer limit contrainsts
    const timeDB = await BusinessTime.findOne({ BusinessID: bid });
    const BusinessClosingTime = await timeDB.BET;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const BSTMins = convertToMinutes(BusinessClosingTime);

    if (currentMinutes >= BSTMins) {
        throw "Business Closed!"
    }

    const countAhead = await queue.countDocuments({
        businessId: bid,
        date: Currentdate,
        JoinedQueue: true
    });

    const postion = countAhead + 1;
    console.log("Current Users postion in the Queue" + postion);

    if (postion >= (await timeDB.CustomerLimitPerDay)) {
        throw "Unable to Book..Customer Limit exceeds for the day"
    }

    //3.Based on the workers availibility add them in the Queue
    const workerDB = await worker.find({ businessId: bid });

    // console.log("🟡Found workers => "+workerDB);
    let chosenWorker = null;
    let minWaitingTime = Infinity;
    let chosenPosition = 0;

for (const d of workerDB) {
    if (d.WorkStatus !== "active") continue;

    let totalWaitingTime = 0;
    for (const e of d.queueInfo) {
        const QueueDB = await queue.findOne({ _id: e.queueID, QueueStatus: "waiting" });
        if (!QueueDB) continue;
        

        const services = await service.find({ _id: { $in: QueueDB.ServiceId } });
        totalWaitingTime += services.reduce(
            (sum, s) => sum + Number(s.AvgDurationPerCustomer),
            0
        );
    }

    if (totalWaitingTime < minWaitingTime) {
        minWaitingTime = totalWaitingTime;
        chosenWorker = d;
        chosenPosition = d.queueInfo.length;
    }
}

if (!chosenWorker) {
    throw "No active workers available";
}

// now do the single assignment, once, to chosenWorker
const expectedSlotStartingTime = new Date(Date.now() + minWaitingTime * 60000);

const newQueue = new queue({
    UserId: uid,
    businessId: bid,
    date: Currentdate,
    ServiceId: serviceids,
    JoinedQueue: true,
    QueueStatus: "waiting",
    CurrentPostion: chosenPosition + 1,
    UserWaitingTime: minWaitingTime,
    expectedStartTime: expectedSlotStartingTime
});

const saavedQueue = await newQueue.save();

await worker.findByIdAndUpdate(chosenWorker._id, {
    $push: {
        queueInfo: {
            queueID: saavedQueue._id,
            QueuePostion: chosenPosition + 1,
            date: now.toLocaleDateString()
        }
    }
});

io.to(uid).emit("queue-estimated-time", expectedSlotStartingTime);
await QueueCountService(bid);

await customer.findOneAndUpdate(
    { _id: uid },
    { $push: { businessId: bid, queueId: saavedQueue._id, date: Currentdate } }
);

await inngestClient.send({
    name: "Queue-After-Join",
    id: "QueueArch-afterJoin",
    data: { uid, bid, qid: saavedQueue._id }
});

return saavedQueue._id;





}

//before joinig and after the queue(for continous updates)
export const QueueCountService = async (qid) => {
    // estimated -wt & queue-count(displaying on update/refresh)
    if(!qid){
        throw "No Associated queue id found"
    }
    const CurrentDate = new Date();
    const now = CurrentDate.toLocaleDateString();
    const queueDB = await queue.findById(qid,{date:now});
    return queueDB;
}

export const UpdatedQueueDataService = async (UpdatedExpectedStartTime, CurrentPostion, uid) => {
    if (!QueueCount || !bid) {
        throw new Error("No Data found!")
    }
    const io = getIO();
    io.to(uid).emit("updated-queue-Data", {
        UpdatedExpectedStartTime,
        CurrentPostion
    })
}