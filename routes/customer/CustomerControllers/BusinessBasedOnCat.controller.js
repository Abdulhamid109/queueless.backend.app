import { BusinessBasedOnCatService, BusinessBasedOnRadService } from "../CustomerServices/businessBasedOncat.service.js";


export const GetBusinessBasedOnCat =async(req,res)=>{
    try {
        const category = req.params.slug;
        const {latitude,longitude} = req.body;
        const Businesses = await BusinessBasedOnCatService(category,latitude,longitude);
        return res.status(200).json(
            {success:true,data:Businesses}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error => "+error}
        )
    }
}

export const GetBusinessBasedonRad = async(req,res)=>{
    try {
        const category = req.params.slug;
        const {latitude,longitude,radius} = req.body;
        const ExtentedBusinesses = BusinessBasedOnRadService(category,latitude,longitude,radius);
        return res.status(200).json(
            {success:true,data:ExtentedBusinesses}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error => "+error}
        )
    }
}