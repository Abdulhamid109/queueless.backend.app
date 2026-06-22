import customer from "../../../models/CustomerModal.js";
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
                // io.to(queueDoc.UserId).emit("UpdatedExpectedStartTime",expectedStartTime);
                //webhook call to Node Server from inngest server
                // calling the webhook connection to trigger the websocket inside the route
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
                // io.to(queueDoc.UserId).emit("currentPostion",)
                const queueInfoData = updatedWorker.queueInfo.find(
                    item => item.queueID.toString() === queueDoc._id.toString()
                );
                await fetch(`${process.env.DEVLINK}/updateQueueData`,
                    {
                        headers: { 'Content-Type': 'application/json' },
                        method: "POST",
                        body: JSON.stringify({
                            "UpdatedExpectedStartTime": UpdatedExpectedStartTime,
                            "CurrentPostion": queueInfoData.QueuePostion,
                            "uid": queueDoc.UserId
                        })
                    }
                )

            }));

            //emitting the total queue count based on the room
            await fetch(`${process.env.DEVLINK}/getTotalQueueCount`,
                    {
                        headers: { 'Content-Type': 'application/json' },
                        method: "POST",
                        body: JSON.stringify({
                            "QueueCount": upcomingQueues.length,
                            "bid": bid
                        })
                    }
                )


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