import { inngestClient } from "../inngestClient.js";


export const KeepAlive = inngestClient.createFunction(
    {id:"Keep-me-alive",triggers:{'cron':"*/9 * * * *"}},
    async({event,step})=>{
        const res = await step.run('keep-me-alive',async()=>{
            await fetch(`https://queueless-backend-app.onrender.com/customer/keep-me-alive`,{
                method:"GET"
            });
        });

        return "Jinda";
    }
)