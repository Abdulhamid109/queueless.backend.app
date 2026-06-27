import dbconnect from "../../../config/dbConfig.js";
import service from "../../../models/serviceModal.js";



dbconnect();

export const addServiceData =async(name,AvgDurationPerCustomer,ChargesPerService,businessId)=>{
    if(!businessId){
        throw new Error("No business associated")
    }
    if(!name || !AvgDurationPerCustomer || !ChargesPerService){
        throw new Error("Empty values")
    }

    const newServiceData = new service({
        name,
        AvgDurationPerCustomer,
        ChargesPerService,
        businessId
    });

    const savedServiceData = await newServiceData.save();
    return true;

}

export const getServiceData = async(bid)=>{
    if(!bid){
        throw new Error("No associated services found!");
    }
    const servicesData = await service.find({businessId:bid});
     return servicesData;
}

export const getSingleService = async(serviceID) =>{
    if(!serviceID){
        throw new Error("Invalid service id!");
    }
    const serviceData = await service.findById(serviceID);
    return serviceData;
}

export const updateService =async(serviceID,name,AvgDurationPerCustomer,ChargesPerService)=>{
    if(!serviceID){
        throw new Error("Invalid service id");
    }
    const updatedServiceData = await service.findByIdAndUpdate(serviceID,{
        name,
        AvgDurationPerCustomer,
        ChargesPerService
    });

    return updatedServiceData;
}