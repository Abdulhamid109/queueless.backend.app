import dbconnect from "../../../config/dbConfig.js";
import customer from "../../../models/CustomerModal.js";
import notifications from "../../../models/NotificationModal.js";
import queue from "../../../models/QueueModal.js";



dbconnect();
export const fetchCustomerProfileData = async (id) => {
    if (!id) {
        throw new Error("user id not found!");
    }

    const CustomerData = await customer.findById(id);
    return CustomerData;
}

export const updateProfileDataService = async (id, name, phone, address, latitude, longitude) => {
    if (!id) {
        throw new Error("User not found!");
    }
    console.log("Data => " + id, name, phone, address, latitude, longitude);
    const updatedCustomer = await customer.findByIdAndUpdate(id, {
        name,
        phone,
        "CustomerCurrentLocation.type": "Point",
        "CustomerCurrentLocation.coordinates": [Number(longitude), Number(latitude)],
        CustomerAddress: address
    }, { new: true });

    console.log(`UpdatedDocument => ${JSON.stringify(updatedCustomer)}`);
    return updatedCustomer;

}

export const DeleteAccountService = async(uid)=>{
    if(uid){
        throw new Error("userid not found");
    }

    await notifications.deleteMany({userid:uid});
    //if there are any active queues then delete them accordingly
    const customerdb = await customer.findById(uid);
    if (!customerdb) {
        throw new Error("customer not found");
    } 
    if(customerdb.activeQueues?.length){
        await Promise.all(customerdb.activeQueues.map(async(data)=>{
            await queue.findByIdAndDelete(data.queueId);
        }))
        
    }
    await customer.findByIdAndDelete(uid);
    return true;

}