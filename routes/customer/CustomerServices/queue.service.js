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

    //1.To check whether the user/customer is already enrolled in the queue
    const userDB = await customer.findById(uid);
    const ispresent = userDB.activeQueues?.find(
        (queue) => (
            queue.businessId.toString() == bid &&
            queue.date.toString() == Currentdate
        )
    )

    if (ispresent) {
        throw "User already in the Queue"
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

    if (postion >= (await TimeDb.CustomerLimitPerDay)) {
        throw "Unable to Book..Customer Limit exceeds for the day"
    }

    //3.Based on the workers availibility add them in the Queue
    const workerDB = await worker.find({ businessId: bid });

    for (const d of workerDB) {
        if (d.WorkStatus == "active") {
            const CustomerPostionBasedOnWorker = await d.queueInfo.length;
            let totalWaitingTime = 0;

            for (const e of d.queueInfo) {
                const QueueDB = await queue.findOne({ _id: e.queueID, QueueStatus: "waiting" });
                if (!queueDB) continue;

                const services = await service.find({
                    _id: { $in: queueDB.ServiceId }
                });
                const queueWaitingTime = services.reduce(
                    (sum, service) => sum + Number(service.AvgDurationPerCustomer),
                    0
                );
                totalWaitingTime += queueWaitingTime;
            }

            const expectedSlotStartingTime = new Date(
                Date.now() + totalWaitingTime * 60000
            )
            const newQueue = new queue({
                UserId: uid,
                businessId: bid,
                date: Currentdate,
                ServiceId: serviceids,
                JoinedQueue: true,
                QueueStatus: "waiting",
                CurrentPostion: CustomerPostionBasedOnWorker + 1,
                UserWaitingTime: totalWaitingTime,
                expectedStartTime: expectedSlotStartingTime   //this is the exp. stTime mapped with the date object

            });

            const saavedQueue = await newQueue.save();
            const updateWorker = await worker.findByIdAndUpdate(
                d._id,
                {
                    $push: {
                        queueInfo: { queueID: saavedQueue._id, QueuePostion: CustomerPostionBasedOnWorker + 1 },
                    }

                },
            );

            //emit an event to the frontend regarding the queuecount and estimatedwaiting time
            const io = getIO();
            io.to(uid).emit("queue-estimated-status")

            const updatedCustomer = await customer.findOneAndUpdate({ _id: uid },
                {
                    $push: {
                        businessId: bid,
                        queueId: saavedQueue._id,
                        date: Currentdate
                    }
                }
            );


            //calling the inngest function here

            await inngestClient.send(
                {
                    name: "Queue-After-Join",
                    id: "QueueArch-afterJoin",
                    data: {
                        uid,
                        bid,
                        qid: saavedQueue._id
                    }
                },
            )

            break;

        }
    }





}

//before joinig and after the queue(for continous updates)
export const QueueCountService = async (QueueCount, bid) => {
    // if (!QueueCount || !bid) {
    //     throw new Error("No Data found!")
    // }
    // get the count of the workers enrolled for the queue of this bid
    // need to optimize it in the later part
    const allworkers = await worker.find({ businessId: bid });
    const io = getIO();
    const workerCounts = allworkers.map(worker => ({
        workerId: worker._id,
        workerName: worker.workerName,
        queueCount: worker.queueInfo.length,
    }));

    io.to(bid).emit("workerQueueUpdated", workerCounts);
    // return workerCounts;
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
