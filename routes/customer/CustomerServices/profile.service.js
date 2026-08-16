import dbconnect from "../../../config/dbConfig.js";
import customer from "../../../models/CustomerModal.js";



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