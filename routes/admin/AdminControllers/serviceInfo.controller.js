import { addServiceData, getServiceData } from "../AdminServices/serviceInfo.service.js";


export const addServiceInfo =async(req,res)=>{
    try {
        const {name,AvgDurationPerCustomer,ChargesPerService,businessId} = req.body;
        const status = await addServiceData(name,AvgDurationPerCustomer,ChargesPerService,businessId);
        return res.status(200).json(
            {success:true}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}

export const getServiceInfo = async(req,res)=>{
    try {
        const bid = req.params.bid;
        const data = await getServiceData(bid);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}