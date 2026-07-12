import { Inngest } from "inngest";

export const inngestClient = new Inngest({ id: "Queueless-application" ,signingKey:process.env.INNGEST_SIGNIN_KEY});
