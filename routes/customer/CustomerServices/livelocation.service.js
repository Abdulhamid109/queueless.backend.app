import customer from "../../../models/CustomerModal.js";


export const updateLiveLocationService =async(uid,latitude,longitude)=>{
    if(!latitude || !longitude){
        throw "Coordinates not found";
    }

    const updateCustomer = await customer.findByIdAndUpdate(uid,{
        LiveLatitude:latitude,
        LiveLongitude:longitude
    });

    return true;

}