import { sendPushNotification } from "../../../helpers/SendNotifications.js";
import customer from "../../../models/CustomerModal.js";
import notifications from "../../../models/NotificationModal.js";
import queue from "../../../models/QueueModal.js";
import service from "../../../models/serviceModal.js";
import worker from "../../../models/workermodal.js";
import { inngestClient } from "../inngestClient.js";


export const RebalanceQueue = await inngestClient.createFunction(
    { id: "QueueArch-Rebalance", triggers: { event: "Queue-Arch-Rebalance" } },
    async ({ event, step }) => {
        const { bid, uid, qid } = event.data;
        // const io = getIO();
        await step.run("rebalancing-Queue", async () => {

            const UpdateCustomer = await customer.findOneAndUpdate(
                { _id: uid },
                {
                    $pull: {
                        activeQueues: {
                            queueId: qid
                        }
                    }
                }
            )

            const workerData = await worker.findOne(
                {
                    businessId: bid,
                    "queueInfo.queueID": qid
                }
            );

            if (!workerData) {
                console.log(`No worker found holding queueID ${qid} — already removed or data mismatch`);
                return "worker entry already removed";
            }

            const currentQueue = workerData.queueInfo.find(
                q => q.queueID.toString() == qid
            )

            const upcomingQueues = workerData.queueInfo.filter(
                q => Number(q.QueuePostion) > Number(currentQueue.QueuePostion)
            );

            // FIX: read the queue doc FIRST (need ServiceId off it below), THEN delete it —
            // findByIdAndUpdate was recreating/upserting behavior you didn't want.
            // findByIdAndDelete removes the document entirely instead of leaving a
            // "failed" record behind.
            const QueueDB = await queue.findById(qid);

            if (!QueueDB) {
                console.log(`Queue document ${qid} already deleted or not found`);
                return "queue entry already removed";
            }

            const ServiceDB = await service.find({
                _id: { $in: QueueDB.ServiceId }
            });

            const deductMins = ServiceDB.reduce(
                (acc, s) => acc + s.AvgDurationPerCustomer, 0
            );

            // Now that we've read everything we need off QueueDB, delete it for real.
            await queue.findByIdAndDelete(qid);


            // Deduct time from each user's ExpectedStartTime in DB also update the postion to (next-1)
            await Promise.all(upcomingQueues.map(async (d) => {
                const queueDoc = await queue.findById(d.queueID);
                // const UpdatedqueuePostion = Number(queueDoc.CurrentPostion) - 1;
                const UpdatedExpectedStartTime = new Date(
                    new Date(queueDoc.expectedStartTime).getTime() - deductMins * 60000
                );
                await queue.findByIdAndUpdate(d.queueID,
                    {
                        expectedStartTime: UpdatedExpectedStartTime,
                        $inc: { CurrentPostion: -1 }
                    },

                );

                const updatedWorker = await worker.findOneAndUpdate(
                    {
                        _id: workerData._id,
                        "queueInfo.queueID": d.queueID
                    },
                    {
                        $inc: {
                            "queueInfo.$.QueuePostion": -1
                        }
                    }
                );

                const queueInfoData = updatedWorker.queueInfo.find(
                    item => item.queueID.toString() === queueDoc._id.toString()
                );

                const customerDB = await customer.findById(d.UserId);
                if(customerDB.fcmToken){
                    await sendPushNotification(
                        customerDB.fcmToken,
                        "Queue Slot Update",
                        "Your Slot is rebalanced kindly check the Queue Page"
                    )

                    const notificationDB = new notifications({
                        userid:d.UserId,
                        businessid:d.businessId,
                        title:"Queue Slot Update",
                        body:"Your Slot is rebalanced kindly check the Queue Page",
                        queueID:d._id,
                        ackStatus:"update"
                    });

                    await notificationDB.save();
                }

            }));

            //remove the Queuefromworker
            await worker.findByIdAndUpdate(workerData._id, {
                $pull: {
                    queueInfo: {
                        queueID: qid
                    }
                }
            });



            console.log(`Deleted queue ${qid} and deducted ${deductMins} mins from ${upcomingQueues.length} queue members`);

        })
    }
)