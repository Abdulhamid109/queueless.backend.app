import { Inngest } from "inngest";
import queue from "../../models/QueueModal.js";

export const inngest = new Inngest({id:"Queueless-application"});

const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);


const AfterJoinWork = inngest.createFunction(
    {id:"QueueArch-afterJoin", triggers:{event:"Queue-After-Join"}},
    async ({event,step}) => {
        const {bid,uid,qid} = event.data;
        let pollCount =0;
        let shouldNotify = false;

        while(!shouldNotify){
            const result = await step.run(`poll-count-${pollCount}`,async (cancelled,Notify)=>{
                const QueueDB = await queue.findById(qid);
                if(!QueueDB || !QueueDB.JoinedQueue){
                    return {cancelled:true}
                }

                const now = new Date();
                const expectedSlotStartingTime = new Date(QueueDB.expectedStartTime);
                const MinsRemaning = (expectedSlotStartingTime.getTime() - now.getTime())/60000;

                if(MinsRemaning<15){
                    return {Notify:true}
                }

                return {Notify:false};
            });

            if(result.cancelled) return;

            if(result.Notify){
                shouldNotify=true;
            }else{
                await step.sleep(`poll-sleep-${pollCount}`, '5m')
            }

            pollCount++;
        }


        //step02 - Acknowledgment sending
        await step.run("Acknowledgement-Sending",async()=>{
            // i need to send the ack inside the apps notification section and the user should accept it
            return "Email and calls will be made";
        });

        //step03:Waiting for remaining time left before sending the ack
        await step.sleep('final-15min', '15m'); 
        
        // step04:Continously checcking the users location whether in the given time if it is in the readius or not
        const isNearbyPresent = await step.run("check-location-nearby",async()=>{
            
            // create an api route which triggers the frontend for getting the live location 
            

            //create a method which return the distance

            // if the distance is less than 50m
                //update the Queuestate in the db
                    //if the service gets compelted before the time finished 
                        // (Update in db state for that Queue) => rearrange the entire time of the queue after me for that worker
                            //fetch all the queues after me calculate the time remaining i.e(earlyservicecompletedtime-actuallserviceompletedtime)
                                //deduct it from the times of entire queue (i.e from the totalwatingtime & recalculate the expectedSlotStartTime)
            // else if the distance is not less that 50m
                // Remove the user from the Queue and rebalance time of entire queue
                    // sending the ack to the next person in the queue(inngest event-driven calling)
                        //remove the queue data from the customer modal


            


        })

    }
)
export const functions =[helloWorld]