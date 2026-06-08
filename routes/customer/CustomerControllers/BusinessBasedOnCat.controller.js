import { BusinessBasedOnCatService } from "../CustomerServices/businessBasedOncat.service.js";


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