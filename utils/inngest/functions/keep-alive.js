import { inngestClient } from "../inngestClient";


export const KeepAlive = inngestClient.createFunction(
    {id:"Keep-me-alive",triggers:{'cron':'* * * 3 *'}},
    async({event,step})=>{
        await step.run('keep-me-alive',()=>{
            await fetch(`${process.env.DEVLINK}/keep-alive`,{
                method:"GET"
            });
        })
    }
)