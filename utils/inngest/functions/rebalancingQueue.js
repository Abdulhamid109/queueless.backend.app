import customer from "../../../models/CustomerModal.js";
import queue from "../../../models/QueueModal.js";
import service from "../../../models/serviceModal.js";
import worker from "../../../models/workermodal.js";
import { inngestClient } from "../inngestClient.js";


export const RebalanceQueue = await inngestClient.createFunction(
    { id: "QueueArch-Rebalance", triggers: { event: "Queue-Arch-Rebalance" } },
    async ({ event, step }) => {
        const { bid, uid, qid } = event.data;
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

            const currentQueue = workerData.queueInfo.find(
                q => q.queueID.toString() == qid
            )

            const upcomingQueues = workerData.queueInfo.filter(
                q => Number(q.QueuePostion) > Number(currentQueue.QueuePostion)
            );

            const QueueDB = await queue.findByIdAndUpdate(qid,
                { QueueStatus: "failed", status: "failed", JoinedQueue: false },
                { new: true }
            );

            const ServiceDB = await service.find({
                _id: { $in: QueueDB.ServiceId }
            });

            const deductMins = ServiceDB.reduce(
                (acc, s) => acc + s.AvgDurationPerCustomer, 0
            );


            // Deduct time from each user's ExpectedStartTime in DB
            await Promise.all(upcomingQueues.map(async (d) => {
                const queueDoc = await queue.findById(d.queueID);
                const UpdatedExpectedStartTime = new Date(
                    new Date(queueDoc.expectedStartTime).getTime() - deductMins * 60000
                );
                await queue.findByIdAndUpdate(d.queueID,
                    {
                        expectedStartTime: UpdatedExpectedStartTime
                    },
                );
                await worker.updateOne(
                    {
                        _id: workerData._id,
                        "queueInfo.queueID": q.queueID
                    },
                    {
                        $inc: {
                            "queueInfo.$.QueuePostion": -1
                        }
                    }
                );
            }));

            //remove the Queuefromworker
            await worker.findByIdAndUpdate(workerData._id, {
                $pull: {
                    queueInfo: {
                        queueID: qid
                    }
                }
            })

            console.log(`Deducted ${deductMins} mins from ${upcomingQueues.length} queue members`);

        })
    }
)