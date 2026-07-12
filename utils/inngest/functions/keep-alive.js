import { inngestClient } from "../inngestClient";


export const KeepAlive = inngestClient.createFunction(
    {id:"Keep-me-alive",triggers:{'cron':"*/3 * * * *"}},
    async({event,step})=>{
        const res = await step.run('keep-me-alive',()=>{
            await fetch(`https://queueless-backend-app.onrender.com/customer/keep-me-alive`,{
                method:"GET"
            });
        });

        return res;
    }
)