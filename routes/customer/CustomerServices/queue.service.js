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
    console.log("joinQueue -bid "+bid)
        console.log("joinQueue -uid "+uid)
    const now = new Date();
    const Currentdate = now.toLocaleDateString();
    const io = getIO();
    

    //1.To check whether the user/customer is already enrolled in the queue
    const existingActiveQueue = await queue.findOne({
        UserId: uid,
        businessId:bid,
        date:Currentdate,
        // JoinedQueue: true
    });

    console.log("Existing Queue => "+existingActiveQueue);

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

//update the users record also
await customer.findByIdAndUpdate(uid,{
    $push:{
        activeQueues:{
            businessId:bid,
            queueId:saavedQueue._id,
            date:now.toLocaleDateString()
        }
    }
});

io.to(uid).emit("queue-estimated-time", expectedSlotStartingTime);
await QueueCountService(bid,uid);


await inngestClient.send({
    name: "Queue-After-Join",
    id: "QueueArch-afterJoin",
    data: { uid, bid, qid: saavedQueue._id }
});

return {qid:saavedQueue._id,wid:chosenWorker._id};
}

//before joinig and after the queue(for continous updates)
export const QueueCountService = async (bid,uid) => {
    // estimated -wt & queue-count(displaying on update/refresh)
    console.log("UID => "+uid);
    console.log("BID => "+bid);
    if(!uid || !bid){
        throw "Something went wrong(ids)"
    }
    const CurrentDate = new Date();
    const now = CurrentDate.toLocaleDateString();

    const CurrentUser = await customer.findById(uid);
    console.log("uid"+CurrentUser);
    if(!CurrentUser){
        console.log("User not found");
    }

    const entry = CurrentUser.activeQueues.find(
        (data)=>(
            data.businessId.toString() === bid && data.date === now
        )
    )

    console.log("Entry obtained => "+entry);
    if(!entry){
        throw "User not in the queue"
    }

    const queueDB = await queue.findOne({_id:entry.queueId});
    console.log("Queue -> "+queueDB);
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

export const exitQueueService = async (bid, uid) => {
    if (!uid || !bid) {
        throw new Error("Necessary ids missing");
    }

    const queueRecord = await queue.findOneAndDelete({ UserId: uid, businessId: bid });
    if (!queueRecord) {
        throw new Error("User not in the queue");
    }

    const ownerWorker = await worker.findOne({
        businessId: bid,
        "queueInfo.queueID": queueRecord._id,
    });

    if (ownerWorker) {
        await worker.updateOne(
            { _id: ownerWorker._id },
            { $pull: { queueInfo: { queueID: queueRecord._id } } }
        );
    }

    await customer.updateOne(
        { _id: uid },
        { $pull: { activeQueues: { queueId: queueRecord._id } } }
    );

    // Recompute counts/positions for remaining people in the business queue,
    // not for the user who just left
    try {
        await QueueCountService(bid);
    } catch (err) {
        console.error("QueueCountService failed post-exit:", err);
        // don't fail the whole exit just because the broadcast/recompute step failed
    }

    return true;
};

//importance if the user fails to accept the acknowledgement
export const DirectQueueRemovalService = async(qid)=>{
    if(!qid){
        throw "Queue ID not found, Operation Failed"
    }

    const DeletedQueue = await queue.findByIdAndDelete(qid);
    return DeletedQueue;

}