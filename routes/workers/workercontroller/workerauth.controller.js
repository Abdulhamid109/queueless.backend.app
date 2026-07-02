import { workerloginService } from "../workerservices/workerauth.service.js";


export const workerAuthController = async(req,res)=>{
    try {
        const {workerEmail} = req.body;
        const token = await workerloginService(workerEmail);
        return res.status(200).json(
            {success:true,token}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}