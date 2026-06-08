import { fetchCustomerProfileData } from "../CustomerServices/profile.service.js";

// here the geting the profile and updating also carried out

export const GetCustomerProfileDataController=async(req,res)=>{
    try {
        const id = req.params.id;
        const Data = await fetchCustomerProfileData(id);
        return res.status(200).json(
            {success:true,Data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal server error"+error}
        )
    }
}


export const UpdateCustomerProfileController =async(id)=>{
    try {
        const id = req.params.id;
    } catch (error) {
        return res.status(500).json(
            {error:"Internal server error"+error}
        )
    }
}