import dbconnect from "../../../config/dbConfig.js";
import customer from "../../../models/CustomerModal.js";



dbconnect();
export const fetchCustomerProfileData = async (id)=>{
    if(!id){
        throw new Error("user id not found!");
    }

    const CustomerData = await customer.findById(id);
    return CustomerData;
}