// import { getDistanceInMeters } from "../../../helpers/getdistance.js";
// import { sendPushNotification } from "../../../helpers/SendNotifications.js";
// import business from "../../../models/BusinessModal.js";
// import customer from "../../../models/CustomerModal.js";
// import notifications from "../../../models/NotificationModal.js";
// import queue from "../../../models/QueueModal.js";
// import service from "../../../models/serviceModal.js";
// import { getIO } from "../../socket.js";
// import { inngestClient } from "../inngestClient.js";

// export const AfterJoinWork = inngestClient.createFunction(
//     { id: "QueueArch-afterJoin", triggers: { event: "Queue-After-Join" } },
//     async ({ event, step }) => {
//         const { bid, uid, qid } = event.data;
//         let pollCount = 0;
//         let shouldNotify = false;
//         let isuserLeft = false;
//         let tries = 0;
//         let userArrived = false;


//         while (!shouldNotify) {
//             const result = await step.run(`poll-count-${pollCount}`, async () => {
//                 const QueueDB = await queue.findById(qid);
//                 if (!QueueDB || !QueueDB.JoinedQueue) {
//                     return { cancelled: true }
//                 }

//                 const now = new Date();
//                 const expectedSlotStartingTime = new Date(QueueDB.expectedStartTime);
//                 const MinsRemaning = (expectedSlotStartingTime.getTime() - now.getTime()) / 60000;

//                 if (MinsRemaning < 15) {
//                     return { Notify: true }
//                 }

//                 return { Notify: false };
//             });

//             if (result.cancelled) return;

//             if (result.Notify) {
//                 shouldNotify = true;
//             } else {
//                 await step.sleep(`poll-sleep-${pollCount}`, '5m')
//             }

//             pollCount++;
//         }


//         //step02 - Acknowledgment sending
//         await step.run("Acknowledgement-Sending", async () => {
//             // i need to send the ack inside the apps notification section + call and the user should accept it
//             const customerDB = await customer.findById(uid);
//             const fcmToken = customerDB.fcmToken;
//             if (fcmToken) {
//                 await sendPushNotification(
//                     fcmToken,
//                     "Queue Update",
//                     "Your turn is coming up — Kindly acknowledge"
//                 );
//                 const newNotification = new notifications({
//                     userid: uid,
//                     businessid: bid,
//                     queueid: qid,
//                     title: "Queue Update",
//                     body: "Your turn is coming up — Kindly acknowledge"
//                 });
//                 const savedNotificationn = await newNotification.save();
//             }

//             return "Email and calls will be made";
//         });




//         //step03:Waiting for remaining time left before sending the ack
//         await step.sleep('final-15min', '1m');

//         await step.run("Acknowledgement-checking", async () => {
//             const notificationDB = await notifications.findOne({ userid: uid,businessid:bid });
//             if (notificationDB.ackStatus == "notcomming") {
//                 //calling the leaveQueue
//                 const response = await fetch(`https://queueless-backend-app.onrender.com/customer/DirectQueueExit/${qid}`)
//                 if (response.status == 200) {
//                     const nextUSer = await step.run('get-next-user', async () => {
//                         const CompQueueEntry = await queue.findById(qid);
//                         return await queue.findOne({
//                             businessId: bid,
//                             date: new Date().toLocaleDateString(),
//                             JoinedQueue: true,
//                             CurrentPostion: CompQueueEntry.CurrentPostion + 1
//                         });
//                     });

//                     //remove the existing user from the queue
//                     await step.run("arch-after-completed", async () => {
//                         await inngestClient.send({
//                             name: "Queue-Arch-Rebalance",
//                             data: {
//                                 bid,
//                                 uid: nextUSer.UserId,
//                                 qid: nextUSer._id,
//                             }
//                         })
//                     })


//                     if (nextUSer) {
//                         await step.run('trigger-next', async () => {
//                             await inngestClient.send({
//                                 name: "Queue-After-Join",
//                                 data: {
//                                     bid,
//                                     uid: nextUSer.UserId,
//                                     qid: nextUSer._id,
//                                 }
//                             })
//                         })
//                     } else{
//                         return "no next users"
//                     }
//                 }
//                 return "left the queue";
//             }

//         });

//         // step04:Continously checcking the users location whether in the given time if it is in the readius or not
//         const isNearbyPresent = await step.run("check-location-nearby", async () => {

//             const userDB = await customer.findById(uid);
//             const businessDB = await business.findById(bid);

//             const distance = getDistanceInMeters(
//                 [userDB.LiveLongitude, userDB.LiveLatitude],
//                 businessDB.BusinessCurrentLocation.coordinates
//             );
//             return distance;
//         });

//         //if the user is in resonable distance
//         if (isNearbyPresent > 50 && isNearbyPresent<150) {
//             // the time should not be hardcoded!
//             await step.sleep("BufferTime", "5m");
//         } else {
//             await step.run("fail/rebalance", async () => {
//                 await inngestClient.send({
//                     name: "Queue-Arch-Rebalance",
//                     data: {
//                         bid,
//                         uid: uid,
//                         qid: qid
//                     }
//                 });
//             });

//             const nextUSer = await step.run('get-next-user', async () => {
//                 const failedEntry = await queue.findById(qid);
//                 return await queue.findOne({
//                     businessId: bid,
//                     date: new Date().toLocaleDateString(),
//                     JoinedQueue: true,
//                     QueueStatus: "waiting",
//                     // CurrentPostion: failedEntry.CurrentPostion + 1
//                 }).sort({ CurrentPostion: 1 });
//             });

//             if (nextUSer) {
//                 await step.run('trigger-next', async () => {
//                     await inngestClient.send({
//                         name: "Queue-After-Join",
//                         data: {
//                             bid,
//                             uid: nextUSer.UserId,
//                             qid: nextUSer._id,
//                         }
//                     })
//                 })
//             } 
//             return { status: "No users in the queue" }
//         }

//         const locationRecheck = await step.run("nearby-recheck", async () => {
//                 const userDB = await customer.findById(uid);
//                 const businessDB = await business.findById(bid);


//                 const distance = getDistanceInMeters(
//                     [userDB.LiveLongitude, userDB.LiveLatitude],
//                     businessDB.BusinessCurrentLocation.coordinates
//                 );
//                 // if the distance is less than 50m
//                 return distance;
//             })

//         if (locationRecheck <= 50) {
//                 await step.run('slot-started', async () => {
//                     const updatedQueue = await queue.findByIdAndUpdate(qid, {
//                         QueueStatus: "started"
//                     })
//                     return "started"
//                 })

//                 //is the allocated time is over or the user leaves the business more than 100 meters
//                 const qdb = await queue.findOne({ _id: qid });
//                 const servicesEnrolled = await qdb.ServiceId;
//                 let totalWaitingTime = 0;
//                 const serviceDocs = await service.find({
//                     _id: { $in: servicesEnrolled }
//                 })

//                 const queueWaitingTime = serviceDocs.reduce(
//                     (sum, serviceDoc) =>
//                         sum + Number(serviceDoc.AvgDurationPerCustomer),
//                     0
//                 );

//                 console.log(queueWaitingTime);
//                 // for demonstration purpose



//             } else {
//                 // if not within go to the next person in the queue (current person failed) -> make sure you update the queuestatus as failed in db rebalnce entire queue
//                 //remove the queue from worker,customer,rearrange entire based on time,start the next user function.

//                 //mark the notification to not-comming
//                 // const notificationDB = await notifications.findOne({userid:uid,businessid:bid});
//                 // if(notificationDB.ackStatus=="comming"){
//                 //     notifications.findByIdAndUpdate(notificationDB._id,{ackStatus:"notcomming"})
//                 // }

//                 await step.run("fail/rebalance", async () => {
//                     await inngestClient.send({
//                         name: "Queue-Arch-Rebalance",
//                         data: {
//                             bid,
//                             uid: uid,
//                             qid: qid
//                         }
//                     });


//                 });

//                 const nextUSer = await step.run('get-next-user', async () => {
//                     const failedEntry = await queue.findById(qid);
//                     return await queue.findOne({
//                         businessId: bid,
//                         date: new Date().toLocaleDateString(),
//                         JoinedQueue: true,
//                         QueueStatus: "waiting",
//                         // CurrentPostion: failedEntry.CurrentPostion + 1
//                     }).sort({ CurrentPostion: 1 });
//                 });

//                 if (nextUSer) {
//                     await step.run('trigger-next', async () => {
//                         await inngestClient.send({
//                             name: "Queue-After-Join",
//                             data: {
//                                 bid,
//                                 uid: nextUSer.UserId,
//                                 qid: nextUSer._id,
//                             }
//                         });
//                     })
//                 } else {
//                     return { status: "No users in the queue" }
//                 }


//             }









//         while (!isuserLeft) {
//             isuserLeft = await step.run(
//                 `user-left-check-${tries}`,
//                 async () => {
//                     const userDB = await customer.findById(uid);
//                     const businessDB = await business.findById(bid);

//                     const distance = getDistanceInMeters(
//                         [userDB.LiveLongitude, userDB.LiveLatitude],
//                         businessDB.BusinessCurrentLocation.coordinates
//                     );

//                     console.log("User left distance => "+distance);

//                     return distance >= 100;
//                 }
//             );

//             if (!isuserLeft) {
//                 await step.sleep(
//                     `sleep-${tries}`,
//                     "10m"
//                 );
//             }

//             tries++;
//         }

//         if (isuserLeft) {
//             //this indicates that the particular person has left the queue
//             const nextUSer = await step.run('get-next-user', async () => {
//                 const CompQueueEntry = await queue.findById(qid);
//                 return await queue.findOne({
//                     businessId: bid,
//                     date: new Date().toLocaleDateString(),
//                     JoinedQueue: true,
//                     CurrentPostion: CompQueueEntry.CurrentPostion + 1
//                 });
//             });

//             //remove the existing user from the queue
//             await step.run("arch-after-completed", async () => {
//                 await inngestClient.send({
//                     name: "Queue-Arch-Rebalance",
//                     data: {
//                         bid,
//                         uid: nextUSer.UserId,
//                         qid: nextUSer._id,
//                     }
//                 })
//             })


//             if (nextUSer) {
//                 await step.run('trigger-next', async () => {
//                     await inngestClient.send({
//                         name: "Queue-After-Join",
//                         data: {
//                             bid,
//                             uid: nextUSer.UserId,
//                             qid: nextUSer._id,
//                         }
//                     })
//                 })
//             }


//         }




//         //if the service gets compelted before the time finished 
//         // (Update in db state for that Queue) => rearrange the entire time of the queue after me for that worker
//         //fetch all the queues after me calculate the time remaining i.e(earlyservicecompletedtime-actuallserviceompletedtime)
//         //deduct it from the times of entire queue (i.e from the totalwatingtime & recalculate the expectedSlotStartTime)
//         // else if the distance is not less that 50m
//         // Remove the user from the Queue and rebalance time of entire queue
//         // sending the ack to the next person in the queue(inngest event-driven calling)
//         //send the notification to the user who are flexible with comming early.(later)
//         //remove the queue data from the customer modal

//     }
// )


// import { getDistanceInMeters } from "../../../helpers/getdistance.js";
// import { sendPushNotification } from "../../../helpers/SendNotifications.js";
// import business from "../../../models/BusinessModal.js";
// import customer from "../../../models/CustomerModal.js";
// import notifications from "../../../models/NotificationModal.js";
// import queue from "../../../models/QueueModal.js";
// import service from "../../../models/serviceModal.js";
// import { getIO } from "../../socket.js";
// import { inngestClient } from "../inngestClient.js";

// export const AfterJoinWork = inngestClient.createFunction(
//     { id: "QueueArch-afterJoin", triggers: { event: "Queue-After-Join" } },
//     async ({ event, step }) => {
//         const { bid, uid, qid } = event.data;
//         let pollCount = 0;
//         let shouldNotify = false;
//         let isuserLeft = false;
//         let tries = 0;
//         // FIX: removed unused `userArrived` variable — declared but never read/written anywhere, dead code.

//         while (!shouldNotify) {
//             const result = await step.run(`poll-count-${pollCount}`, async () => {
//                 const QueueDB = await queue.findById(qid);
//                 if (!QueueDB || !QueueDB.JoinedQueue) {
//                     return { cancelled: true }
//                 }

//                 const now = new Date();
//                 const expectedSlotStartingTime = new Date(QueueDB.expectedStartTime);
//                 const MinsRemaning = (expectedSlotStartingTime.getTime() - now.getTime()) / 60000;

//                 if (MinsRemaning < 15) {
//                     return { Notify: true }
//                 }

//                 return { Notify: false };
//             });

//             if (result.cancelled) return;

//             if (result.Notify) {
//                 shouldNotify = true;
//             } else {
//                 await step.sleep(`poll-sleep-${pollCount}`, '5m')
//             }

//             pollCount++;
//         }


//         //step02 - Acknowledgment sending
//         await step.run("Acknowledgement-Sending", async () => {
//             // i need to send the ack inside the apps notification section + call and the user should accept it
//             const customerDB = await customer.findById(uid);
//             const fcmToken = customerDB.fcmToken;
//             if (fcmToken) {
//                 await sendPushNotification(
//                     fcmToken,
//                     "Queue Update",
//                     "Your turn is coming up — Kindly acknowledge"
//                 );
//                 const newNotification = new notifications({
//                     userid: uid,
//                     businessid: bid,
//                     queueid: qid, // note: kept as-is — used below to make the notification lookup more specific, see FIX in Acknowledgement-checking
//                     title: "Queue Update",
//                     body: "Your turn is coming up — Kindly acknowledge"
//                 });
//                 const savedNotificationn = await newNotification.save();
//             }
//             // FIX (flag, not changed): if fcmToken is falsy, NO notification document is ever created here,
//             // but "Acknowledgement-checking" below still queries for one and previously assumed it exists.
//             // See the null-check fix added there.

//             return "Email and calls will be made";
//         });




//         //step03:Waiting for remaining time left before sending the ack
//         // FIX (flag, not changed — needs your input): this step is named 'final-15min' but sleeps only 1 minute.
//         // Left as-is since I don't know your intended real value — but this looks like a placeholder that
//         // never got updated. Confirm whether this should actually be closer to '10m' or similar.
//         await step.sleep('final-15min', '1m');

//         await step.run("Acknowledgement-checking", async () => {
//             // FIX: added qid to the query — previously only filtered by userid + businessid, which could
//             // match a stale notification from a prior queue session for the same user/business pair.
//             const notificationDB = await notifications.findOne({ userid: uid, businessid: bid, queueid: qid });

//             // FIX: added null check — if no fcmToken existed earlier, no notification document was ever
//             // created, and this would throw "Cannot read properties of null (reading 'ackStatus')".
//             if (!notificationDB) {
//                 return "No notification record found — user may not have a registered device token";
//             }

//             if (notificationDB.ackStatus == "notcomming") {
//                 //calling the leaveQueue
//                 const response = await fetch(`https://queueless-backend-app.onrender.com/customer/DirectQueueExit/${qid}`)
//                 // FIX (flag, not changed): this makes an external HTTP call back into your own API instead of
//                 // calling the underlying service function directly. Recommend importing and calling the
//                 // DirectQueueExit service/controller logic in-process instead — avoids network flakiness,
//                 // hardcoded domain, and missing timeout/error handling on this fetch call.
//                 if (response.status == 200) {
//                     const nextUSer = await step.run('get-next-user', async () => {
//                         const CompQueueEntry = await queue.findById(qid);
//                         return await queue.findOne({
//                             businessId: bid,
//                             date: new Date().toLocaleDateString(),
//                             JoinedQueue: true,
//                             CurrentPostion: CompQueueEntry.CurrentPostion + 1
//                         });
//                     });

//                     // FIX: moved both the rebalance-send and trigger-next inside a single `if (nextUSer)` guard.
//                     // Previously, "arch-after-completed" ran unconditionally BEFORE the null check below,
//                     // so if nextUSer was null (last person in queue), this threw
//                     // "Cannot read properties of null (reading 'UserId')".
//                     if (nextUSer) {
//                         await step.run("arch-after-completed", async () => {
//                             await inngestClient.send({
//                                 name: "Queue-Arch-Rebalance",
//                                 data: {
//                                     bid,
//                                     uid: nextUSer.UserId,
//                                     qid: nextUSer._id,
//                                 }
//                             })
//                         })

//                         await step.run('trigger-next', async () => {
//                             await inngestClient.send({
//                                 name: "Queue-After-Join",
//                                 data: {
//                                     bid,
//                                     uid: nextUSer.UserId,
//                                     qid: nextUSer._id,
//                                 }
//                             })
//                         })
//                     }
//                 }
//                 // FIX: added return here — this function instance is for a user who just left the queue;
//                 // it must stop here rather than falling through into the location-check logic below,
//                 // which would otherwise keep running for a user who's already been removed.
//                 return "left the queue";
//             }

//             return "No notifications found!";

//         });

//         // step04:Continously checcking the users location whether in the given time if it is in the readius or not
//         const isNearbyPresent = await step.run("check-location-nearby", async () => {

//             const userDB = await customer.findById(uid);
//             const businessDB = await business.findById(bid);

//             const distance = getDistanceInMeters(
//                 [userDB.LiveLongitude, userDB.LiveLatitude],
//                 businessDB.BusinessCurrentLocation.coordinates
//             );
//             return distance;
//         });

//         //if the user is in resonable distance
//         // FIX: this condition was backwards. `isNearbyPresent > 50 && < 150` was being treated as "on track,
//         // keep waiting" — but a distance of 50-150m means the user is NOT yet close. A distance <= 50m means
//         // the user has actually arrived, and that case was previously falling into the `else` (failure/rebalance)
//         // branch, incorrectly punishing users who arrived on time or early.
//         if (isNearbyPresent > 50) {
//             // user is not yet close enough — give them more time
//             await step.sleep("BufferTime", "5m");
//         } else {
//             // isNearbyPresent <= 50 — user is close/arrived, this is the success path, handled further below
//             // by the locationRecheck block. No action needed here.
//         }

//         // FIX: the entire "else" failure/rebalance block that used to sit here (for isNearbyPresent < 50 or > 150)
//         // has been removed from this spot — it was misplaced logic firing on arrival, not on failure.
//         // Genuine failure (user never gets close even after the buffer sleep) is now handled by the
//         // locationRecheck check immediately below, which already had its own correctly-guarded failure branch.

//         const locationRecheck = await step.run("nearby-recheck", async () => {
//             const userDB = await customer.findById(uid);
//             const businessDB = await business.findById(bid);

//             const distance = getDistanceInMeters(
//                 [userDB.LiveLongitude, userDB.LiveLatitude],
//                 businessDB.BusinessCurrentLocation.coordinates
//             );
//             // if the distance is less than 50m
//             return distance;
//         })

//         if (locationRecheck <= 50) {
//             await step.run('slot-started', async () => {
//                 const updatedQueue = await queue.findByIdAndUpdate(qid, {
//                     QueueStatus: "started"
//                 })
//                 return "started"
//             })

//             //is the allocated time is over or the user leaves the business more than 100 meters
//             const qdb = await queue.findOne({ _id: qid });
//             const servicesEnrolled = await qdb.ServiceId;
//             let totalWaitingTime = 0;
//             const serviceDocs = await service.find({
//                 _id: { $in: servicesEnrolled }
//             })

//             const queueWaitingTime = serviceDocs.reduce(
//                 (sum, serviceDoc) =>
//                     sum + Number(serviceDoc.AvgDurationPerCustomer),
//                 0
//             );

//             console.log(queueWaitingTime);
//             // for demonstration purpose

//         } else {
//             // if not within go to the next person in the queue (current person failed) -> make sure you update the queuestatus as failed in db rebalnce entire queue
//             //remove the queue from worker,customer,rearrange entire based on time,start the next user function.

//             //mark the notification to not-comming
//             // const notificationDB = await notifications.findOne({userid:uid,businessid:bid});
//             // if(notificationDB.ackStatus=="comming"){
//             //     notifications.findByIdAndUpdate(notificationDB._id,{ackStatus:"notcomming"})
//             // }

//             await step.run("fail/rebalance", async () => {
//                 await inngestClient.send({
//                     name: "Queue-Arch-Rebalance",
//                     data: {
//                         bid,
//                         uid: uid,
//                         qid: qid
//                     }
//                 });
//             });

//             const nextUSer = await step.run('get-next-user', async () => {
//                 const failedEntry = await queue.findById(qid);
//                 return await queue.findOne({
//                     businessId: bid,
//                     date: new Date().toLocaleDateString(),
//                     JoinedQueue: true,
//                     QueueStatus: "waiting",
//                 }).sort({ CurrentPostion: 1 });
//             });

//             if (nextUSer) {
//                 await step.run('trigger-next', async () => {
//                     await inngestClient.send({
//                         name: "Queue-After-Join",
//                         data: {
//                             bid,
//                             uid: nextUSer.UserId,
//                             qid: nextUSer._id,
//                         }
//                     });
//                 })
//             }
//             // FIX: added return in both branches of this if/else — previously, only the "else { return {status: ...} }"
//             // existed, but the `if (nextUSer)` success branch had no return, so execution fell through into the
//             // final `while (!isuserLeft)` polling loop below, still running for a user who just failed and was
//             // already rebalanced out. That polling loop would then run indefinitely for a removed user.
//             return { status: nextUSer ? "rebalanced, next user triggered" : "No users in the queue" };
//         }

//         while (!isuserLeft) {
//             isuserLeft = await step.run(
//                 `user-left-check-${tries}`,
//                 async () => {
//                     const userDB = await customer.findById(uid);
//                     const businessDB = await business.findById(bid);

//                     const distance = getDistanceInMeters(
//                         [userDB.LiveLongitude, userDB.LiveLatitude],
//                         businessDB.BusinessCurrentLocation.coordinates
//                     );

//                     console.log("User left distance => " + distance);

//                     return distance >= 10;
//                 }
//             );

//             if (!isuserLeft) {
//                 await step.sleep(
//                     `sleep-${tries}`,
//                     "1m"
//                 );
//             }

//             tries++;
//         }

//         if (isuserLeft) {
//             //this indicates that the particular person has left the queue
//             const nextUSer = await step.run('get-next-user', async () => {
//                 const CompQueueEntry = await queue.findById(qid);
//                 return await queue.findOne({
//                     businessId: bid,
//                     date: new Date().toLocaleDateString(),
//                     JoinedQueue: true,
//                     CurrentPostion: CompQueueEntry.CurrentPostion + 1
//                 });
//             });

//             // FIX: same pattern as earlier — moved the unconditional "arch-after-completed" send inside
//             // the `if (nextUSer)` guard instead of running it before the null check.
//             if (nextUSer) {
//                 await step.run("arch-after-completed", async () => {
//                     await inngestClient.send({
//                         name: "Queue-Arch-Rebalance",
//                         data: {
//                             bid,
//                             uid: nextUSer.UserId,
//                             qid: nextUSer._id,
//                         }
//                     })
//                 })

//                 await step.run('trigger-next', async () => {
//                     await inngestClient.send({
//                         name: "Queue-After-Join",
//                         data: {
//                             bid,
//                             uid: nextUSer.UserId,
//                             qid: nextUSer._id,
//                         }
//                     })
//                 })
//             }
//         }

//         //if the service gets compelted before the time finished 
//         // (Update in db state for that Queue) => rearrange the entire time of the queue after me for that worker
//         //fetch all the queues after me calculate the time remaining i.e(earlyservicecompletedtime-actuallserviceompletedtime)
//         //deduct it from the times of entire queue (i.e from the totalwatingtime & recalculate the expectedSlotStartTime)
//         // else if the distance is not less that 50m
//         // Remove the user from the Queue and rebalance time of entire queue
//         // sending the ack to the next person in the queue(inngest event-driven calling)
//         //send the notification to the user who are flexible with comming early.(later)
//         //remove the queue data from the customer modal

//     }
// )

import { getDistanceInMeters } from "../../../helpers/getdistance.js";
import { sendPushNotification } from "../../../helpers/SendNotifications.js";
import business from "../../../models/BusinessModal.js";
import Climit from "../../../models/Climithistory.js";
import customer from "../../../models/CustomerModal.js";
import notifications from "../../../models/NotificationModal.js";
import queue from "../../../models/QueueModal.js";
import service from "../../../models/serviceModal.js";
import { getIO } from "../../socket.js";
import { inngestClient } from "../inngestClient.js";

export const AfterJoinWork = inngestClient.createFunction(
    { id: "QueueArch-afterJoin", triggers: { event: "Queue-After-Join" } },
    async ({ event, step }) => {
        const { bid, uid, qid } = event.data;
        let pollCount = 0;
        let shouldNotify = false;
        const tempqueue = 0;

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
            const customerDB = await customer.findById(uid);
            const fcmToken = customerDB.fcmToken;
            const businessdb = await business.findById(bid);
            const businessName = await businessdb.BusinessName;
            if (fcmToken) {
                await sendPushNotification(
                    fcmToken,
                    "Queue Update",
                    "Your turn is coming up — Kindly acknowledge"
                );
                const newNotification = new notifications({
                    userid: uid,
                    businessid: bid,
                    queueID: qid,
                    title: "Queue Update",
                    body: `Your turn is coming up ${businessName} — Kindly acknowledge`
                });
                await newNotification.save();
            }
            return "Email and calls/notification have been made";
        });

        //step03: Sleep for the confirmation window (travel + confirmation time)
        // NOTE: '1m' here for dev/testing — change to '15m' for production
        await step.sleep('final-15min', '1m');

        await step.run("Acknowledgement-checking", async () => {
            const notificationDB = await notifications.findOne({ userid: uid, businessid: bid, queueID: qid });
            
            // FIX: added null check — if no fcmToken existed, no notification doc was ever created,
            // and this would throw "Cannot read properties of null (reading 'ackStatus')"
            if (!notificationDB) {
                return "No notification record — likely missing device token";
            }

            // FIX: this is the actual bug from before — previously only checked for "notcomming".
            // Now explicitly handles all three real outcomes: user said no, user never responded
            // within the window (still "pending" or whatever your default is), or user confirmed.
            if (notificationDB.ackStatus === "comming") {
                return "User confirmed — proceeding to location check";
            }

            // Covers both "notcomming" AND anyone who simply never responded in time —
            // both cases should exit the queue, since an unconfirmed slot this close
            // to the user's turn can't be safely held either way.
            const response = await fetch(`https://queueless-backend-app.onrender.com/customer/DirectQueueExit/${qid}`)
            if (response.status == 200) {
                const nextUSer = await step.run('get-next-user', async () => {
                    return await queue.findOne({
                        _id: { $ne: qid },
                        businessId: bid,
                        date: new Date().toLocaleDateString(),
                        JoinedQueue: true,
                        QueueStatus: "waiting",
                    }).sort({ CurrentPostion: 1 });
                });

                if (nextUSer) {
                    await step.run("arch-after-completed", async () => {
                        await inngestClient.send({
                            name: "Queue-Arch-Rebalance",
                            data: { bid, uid: nextUSer.UserId, qid: nextUSer._id }
                        })
                    })

                    await step.run('trigger-next', async () => {
                        await inngestClient.send({
                            name: "Queue-After-Join",
                            data: { bid, uid: nextUSer.UserId, qid: nextUSer._id }
                        })
                    })
                }
            }
            //notification sent to user for not comming
            const customerDB = await customer.findById(uid);
            const fcmToken = customerDB.fcmToken;
            const businessdb = await business.findById(bid);
            const businessName = await businessdb.BusinessName;
            if (fcmToken) {
                await sendPushNotification(
                    fcmToken,
                    "Queue Update",
                    `Your turn has been cancelled for ${businessName}`
                );
                const newNotification = new notifications({
                    userid: uid,
                    businessid: bid,
                    queueID: qid,
                    title: "Queue Update",
                    body: `Your turn has been cancelled for ${businessName}`,
                    ackStatus:"update"
                });
                await newNotification.save();
            }
            return "left the queue";
        });

        // if (finalAckStatus === "notcomming" || finalAckStatus === "timeout" || finalAckStatus === "missing") {
        //     const response = await fetch(`https://queueless-backend-app.onrender.com/customer/DirectQueueExit/${qid}`)
        //     if (response.status == 200) {
        //         const nextUSer = await step.run('get-next-user', async () => {
        //             return await queue.findOne({
        //                 _id: { $ne: qid }, // FIX (Bug 2, from previous pass): exclude self, otherwise a
        //                 // solo user's own still-"waiting" entry could match itself
        //                 // due to the async gap before RebalanceQueue finishes.
        //                 businessId: bid,
        //                 date: new Date().toLocaleDateString(),
        //                 JoinedQueue: true,
        //                 QueueStatus: "waiting",
        //             }).sort({ CurrentPostion: 1 });
        //         });

        //         if (nextUSer) {
        //             await step.run("arch-after-completed", async () => {
        //                 await inngestClient.send({
        //                     name: "Queue-Arch-Rebalance",
        //                     data: { bid, uid: nextUSer.UserId, qid: nextUSer._id }
        //                 })
        //             })

        //             await step.run('trigger-next', async () => {
        //                 await inngestClient.send({
        //                     name: "Queue-After-Join",
        //                     data: { bid, uid: nextUSer.UserId, qid: nextUSer._id }
        //                 })
        //             })
        //         }
        //     }
        //     return "left the queue";
        // }

        // finalAckStatus === "comming" — proceed to location tracking

        const isNearbyPresent = await step.run("check-location-nearby", async () => {
            const userDB = await customer.findById(uid);
            const businessDB = await business.findById(bid);

            // DEBUG (temporary — remove once Bug 3 is confirmed/fixed):
            console.log("DEBUG customer live coords:", userDB.LiveLatitude, userDB.LiveLongitude);
            console.log("DEBUG business coords:", businessDB.BusinessCurrentLocation.coordinates);

            const distance = getDistanceInMeters(
                [userDB.LiveLongitude, userDB.LiveLatitude],
                businessDB.BusinessCurrentLocation.coordinates
            );

            console.log("DEBUG computed distance (isNearbyPresent):", distance);

            return distance;
        });

        if (isNearbyPresent > 50) {
            await step.sleep("BufferTime", "1m");
        }
        // isNearbyPresent <= 50 — arrived, success path continues below

        const locationRecheck = await step.run("nearby-recheck", async () => {
            const userDB = await customer.findById(uid);
            const businessDB = await business.findById(bid);

            // DEBUG (temporary — remove once Bug 3 is confirmed/fixed):
            console.log("DEBUG recheck customer live coords:", userDB.LiveLatitude, userDB.LiveLongitude);
            console.log("DEBUG recheck business coords:", businessDB.BusinessCurrentLocation.coordinates);

            const distance = getDistanceInMeters(
                [userDB.LiveLongitude, userDB.LiveLatitude],
                businessDB.BusinessCurrentLocation.coordinates
            );

            console.log("DEBUG computed distance (locationRecheck):", distance);

            return distance;
        })

        if (locationRecheck <= 50) {
            await step.run('slot-started', async () => {
                await queue.findByIdAndUpdate(qid, { QueueStatus: "started" })
                return "started"
            })

            const qdb = await queue.findOne({ _id: qid });
            const servicesEnrolled = qdb.ServiceId;
            const serviceDocs = await service.find({ _id: { $in: servicesEnrolled } })

            const queueWaitingTime = serviceDocs.reduce(
                (sum, serviceDoc) => sum + Number(serviceDoc.AvgDurationPerCustomer),
                0
            );

            console.log(queueWaitingTime);

        } else {
            await step.run("fail/rebalance", async () => {
                await inngestClient.send({
                    name: "Queue-Arch-Rebalance",
                    data: { bid, uid: uid, qid: qid }
                });
            });

            const nextUSer = await step.run('get-next-user', async () => {
                return await queue.findOne({
                    _id: { $ne: qid }, // FIX (Bug 2): same self-exclusion
                    businessId: bid,
                    date: new Date().toLocaleDateString(),
                    JoinedQueue: true,
                    QueueStatus: "waiting",
                }).sort({ CurrentPostion: 1 });
            });

            if (nextUSer) {
                await step.run('trigger-next', async () => {
                    await inngestClient.send({
                        name: "Queue-After-Join",
                        data: { bid, uid: nextUSer.UserId, qid: nextUSer._id }
                    });
                })
            }
            return { status: nextUSer ? "rebalanced, next user triggered" : "No users in the queue" };
        }

        let isuserLeft = false;
        let tries = 0;

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

                    console.log("User left distance => " + distance);

                    return distance >= 10;
                }
            );

            if (!isuserLeft) {
                await step.sleep(`sleep-${tries}`, "1m");
            }

            tries++;
        }

        if (isuserLeft) {
            //delete the existing queue from the db ca;; direct qeuue
            // await step.run(`removing-existinguser-queue-${qid}`,async()=>{
            //     const response =  await fetch(`https://queueless-backend-app.onrender.com/customer/DirectQueueExit/${qid}`)
            //     if(response.status==200){
            //         return "removed user from the queue"
            //     }
            //     if(response.status!=200){
            //         return `response=> ${JSON.stringify(response.body)} -- ${response.status}`
            //     }
            // })
            const customerDB = await customer.findById(uid);
            const fcmToken = customerDB.fcmToken;
            const businessdb = await business.findById(bid);
            const businessName = await businessdb.BusinessName;
            
            if (fcmToken) {
                await sendPushNotification(
                    fcmToken,
                    "Queue Update",
                    `Your turn has been completed for ${businessName}`
                );
                const newNotification = new notifications({
                    userid: uid,
                    businessid: bid,
                    queueID: qid,
                    title: "Queue Update",
                    body: `Your turn has been completed for ${businessName}`,
                    ackStatus:"update"
                });
                await newNotification.save();
                tempqueue=tempqueue+1;
            }
            
            //made the chnage the climit schema after the user 
            const now = new Date();
            const currentdate = now.toLocaleDateString();
            const newClimit = new Climit({
                customercomplimit : tempqueue,
                bid:bid,
                date:currentdate
            });

            await newClimit.save();

            await step.run(`fail/rebalance-${qid}`, async () => {
                await inngestClient.send({
                    name: `Queue-Arch-Rebalance`,
                    data: { bid, uid: uid, qid: qid }
                });
            });

            const nextUSer = await step.run('get-next-user', async () => {
                const CompQueueEntry = await queue.findById(qid);
                return await queue.findOne({
                    _id: { $ne: qid }, 
                    businessId: bid,
                    date: new Date().toLocaleDateString(),
                    JoinedQueue: true,
                    CurrentPostion: CompQueueEntry.CurrentPostion + 1
                });
            });

            if (nextUSer) {
                await step.run("arch-after-completed", async () => {
                    await inngestClient.send({
                        name: "Queue-Arch-Rebalance",
                        data: { bid, uid: nextUSer.UserId, qid: nextUSer._id }
                    });
                })

                await step.run('trigger-next', async () => {
                    await inngestClient.send({
                        name: "Queue-After-Join",
                        data: { bid, uid: nextUSer.UserId, qid: nextUSer._id }
                    })
                })
            }else{
                return "No next users in the queue"
            }

        }
    }
)