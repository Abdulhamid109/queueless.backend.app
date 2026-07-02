import worker from "../../../models/workermodal.js";
import jwt from "jsonwebtoken";


export const workerloginService=async(email)=>{
    if(!email){
        throw new Error("Email id not found");
    }
    const isPresent = await worker.findOne({WorkerEmail:email});
    if(!isPresent) {
        throw new Error("Email not found!");
    }
    const payload = {
        wid:isPresent._id,
        email:isPresent.email,
        role:"worker"
    }

    const token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'1d'});
    return token;
}
