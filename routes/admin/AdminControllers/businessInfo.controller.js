import { addbusinessData, getBusinessData, getBusinessDataFromID, updateBusinessDataService } from "../AdminServices/businessInfo.service.js";


export const addbusinessInfo =async(req,res)=>{
    try {
        const {adminid,BusinessName,BusinessAddress,BusinessCategory,Country,State,City,pinCode,website,latitude,longitude} = await req.body;
        const bid = await addbusinessData(adminid,BusinessName,BusinessAddress,BusinessCategory,Country,State,City,pinCode,website,latitude,longitude);
        return res.status(200).json(
            {success:true,bid}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server errror"+error}
        )
    }
}


export const getBusinessInfo =async(req,res)=>{
    try {
        const aid = req.params.adminid;
        const data = await getBusinessData(aid);
        return res.status(200).json({
            success:true,data
        });
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server errror"+error}
        )
    }
}

export const getBusinessBasedOnId =async(req,res)=>{
    try {
        const bid = req.params.bid;
        const data = await getBusinessDataFromID(bid);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server errror"+error}
        )
    }
}

export const updateBusinessData =async(req,res)=>{
    try {
        const adminid = req.params.adminid;
        const bid = req.params.bid;
        const {BusinessName,BusinessAddress,BusinessCategory,Country,State,City,pinCode,website,latitude,longitude} = req.body;
        const data = await updateBusinessDataService(bid,adminid,BusinessName,BusinessAddress,BusinessCategory,Country,State,City,pinCode,website,latitude,longitude);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error}
        )
    }
}