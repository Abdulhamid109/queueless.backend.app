import { KmaService } from "../CustomerServices/kma.service.js";


export const kmaController =async(req,res)=>{
    try {
        const data = await KmaService();
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server errror => "+error}
        )
    }
}