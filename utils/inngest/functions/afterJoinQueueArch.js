import { getDistanceInMeters } from "../../../helpers/getdistance.js";
import business from "../../../models/BusinessModal.js";
import customer from "../../../models/CustomerModal.js";
import queue from "../../../models/QueueModal.js";
import service from "../../../models/serviceModal.js";
import { inngestClient } from "../inngestClient.js";

export const AfterJoinWork = inngestClient.createFunction(
    { id: "QueueArch-afterJoin", triggers: { event: "Queue-After-Join" } },
    async ({ event, step }) => {
        const { bid, uid, qid } = event.data;
        let pollCount = 0;
        let shouldNotify = false;
        let isuserLeft = false;
        let tries = 0;
        let userArrived = false;

        while (!shouldNotify) {
            const result = await step.run(`poll-count-${pollCount}`, async () => {
                const QueueDB = await queue.findById(qid);
                if (!QueueDB || !QueueDB.JoinedQueue) {
                    return { cancelled: true }
                }

                const now = new Date();
                const expectedSlotStartingTime = new Date(QueueDB.expectedStartTime);
                const MinsRemaning = (expectedSlotStartingTime.getTime() - now.getTime()) / 60000;

                if (MinsRemaning < 15) {
                    return { Notify: true }
                }

                return { Notify: false };
            });

            if (result.cancelled) return;

            if (result.Notify) {
                shouldNotify = true;
            } else {
                await step.sleep(`poll-sleep-${pollCount}`, '5m')
            }

            pollCount++;
        }


        //step02 - Acknowledgment sending
        await step.run("Acknowledgement-Sending", async () => {
            // i need to send the ack inside the apps notification section and the user should accept it
            return "Email and calls will be made";
        });


        //step03:Waiting for remaining time left before sending the ack
        await step.sleep('final-15min', '15m');

        // step04:Continously checcking the users location whether in the given time if it is in the readius or not
        const isNearbyPresent = await step.run("check-location-nearby", async () => {

            // create an api route which triggers the frontend for getting the live location 
            const userDB = await customer.findById(uid);
            const businessDB = await business.findById(bid);

            //create a method which return the distance

            const distance = getDistanceInMeters(
                [userDB.LiveLongitude, userDB.LiveLatitude],
                businessDB.BusinessCurrentLocation.coordinates
            );
            // if the distance is less than 50m
            return distance;
        });

        if (isNearbyPresent <= 150) {
            await step.sleep("BufferTime", "5m");

            const locationRecheck = await step.run("nearby-recheck", async () => {
                const userDB = await customer.findById(uid);
                const businessDB = await business.findById(bid);

                //create a method which return the distance

                const distance = getDistanceInMeters(
                    [userDB.LiveLongitude, userDB.LiveLatitude],
                    businessDB.BusinessCurrentLocation.coordinates
                );
                // if the distance is less than 50m
                return distance;
            })

            if (locationRecheck <= 50) {
                await step.run('slot-started', async () => {
                    const updatedQueue = await queue.findByIdAndUpdate(qid, {
                        QueueStatus: "started"
                    })
                })

                //is the allocated time is over or the user leaves the business more than 100 meters
                const qdb = await queue.findOne({ _id: qid });
                const servicesEnrolled = await qdb.ServiceId;
                let totalWaitingTime = 0;
                const serviceDocs = await service.find({
                    _id: { $in: servicesEnrolled }
                })

                const queueWaitingTime = serviceDocs.reduce(
                    (sum, serviceDoc) =>
                        sum + Number(serviceDoc.AvgDurationPerCustomer),
                    0
                );

                console.log(queueWaitingTime);
            } else {
                // if not within go to the next person in the queue (current person failed) -> make sure you update the queuestatus as failed in db rebalnce entire queue
                //remove the queue from worker,customer,rearrange entire based on time,start the next user function.

                await step.run("fail/rebalance", async () => {
                    await inngest.send({
                        name: "Queue-Arch-Rebalance",
                        data: {
                            bid,
                            uid: uid,
                            qid: qid
                        }
                    })
                });

                const nextUSer = await step.run('get-next-user', async () => {
                    const failedEntry = await queue.findById(qid);
                    return await queue.findOne({
                        businessId: bid,
                        date: new Date().toLocaleDateString(),
                        JoinedQueue: true,
                        QueueStatus: "waiting",
                        // CurrentPostion: failedEntry.CurrentPostion + 1
                    }).sort({ CurrentPostion: 1 });
                });

                if (nextUSer) {
                    await step.run('trigger-next', async () => {
                        await inngest.send({
                            name: "Queue-After-Join",
                            data: {
                                bid,
                                uid: nextUSer.UserId,
                                qid: nextUSer._id,
                            }
                        })
                    })
                }


            }

        }





        while (!isuserLeft) {
            isuserLeft = await step.run(
                `user-left-check-${tries}`,
                async () => {
                    const userDB = await customer.findById(uid);
                    const businessDB = await business.findById(bid);

                    const distance = getDistanceInMeters(
                        [userDB.LiveLongitude, userDB.LiveLatitude],
                        businessDB.BusinessCurrentLocation.coordinates
                    );

                    return distance >= 100;
                }
            );

            if (!isuserLeft) {
                await step.sleep(
                    `sleep-${tries}`,
                    "10m"
                );
            }

            tries++;
        }

        if (isuserLeft) {
            //this indicates that the particular person has left the queue
            const nextUSer = await step.run('get-next-user', async () => {
                const CompQueueEntry = await queue.findById(qid);
                return await queue.findOne({
                    businessId: bid,
                    date: new Date().toLocaleDateString(),
                    JoinedQueue: true,
                    CurrentPostion: CompQueueEntry.CurrentPostion + 1
                });
            });

            //remove the existing user from the queue
            await step.run("arch-after-completed", async () => {
                await inngest.send({
                    name: "Queue-Arch-Rebalance",
                    data: {
                        bid,
                        uid: nextUSer.UserId,
                        qid: nextUSer._id,
                    }
                })
            })


            if (nextUSer) {
                await step.run('trigger-next', async () => {
                    await inngest.send({
                        name: "Queue-After-Join",
                        data: {
                            bid,
                            uid: nextUSer.UserId,
                            qid: nextUSer._id,
                        }
                    })
                })
            }


        }




        //if the service gets compelted before the time finished 
        // (Update in db state for that Queue) => rearrange the entire time of the queue after me for that worker
        //fetch all the queues after me calculate the time remaining i.e(earlyservicecompletedtime-actuallserviceompletedtime)
        //deduct it from the times of entire queue (i.e from the totalwatingtime & recalculate the expectedSlotStartTime)
        // else if the distance is not less that 50m
        // Remove the user from the Queue and rebalance time of entire queue
        // sending the ack to the next person in the queue(inngest event-driven calling)
        //send the notification to the user who are flexible with comming early.(later)
        //remove the queue data from the customer modal







    }
)