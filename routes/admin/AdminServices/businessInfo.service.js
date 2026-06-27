import dbconnect from "../../../config/dbConfig.js"
import business from "../../../models/BusinessModal.js";




dbconnect();
export const addbusinessData = async (adminid, BusinessName, BusinessAddress, BusinessCategory, Country, State, City, pinCode, website, latitude, longitude) => {
    if (!adminid) {
        throw new Error("Unauthorized Admin!")
    }
    if (!BusinessName || !BusinessAddress || !BusinessCategory || !Country || !State || !City || !pinCode || !latitude || !longitude) {
        throw new Error("Values incompleted!")
    }



    const newBusinessInformation = new business({
        adminid,
        BusinessName,
        BusinessAddress,
        BusinessCategory,
        Country,
        State,
        City,
        pinCode,
        website,
        "BusinessCurrentLocation.type": "Point",
        "BusinessCurrentLocation.coordinates": [longitude, latitude],
    });

    const savedBusiness = await newBusinessInformation.save();
    return savedBusiness._id;
}

export const getBusinessData = async (adminid) => {
    if (!adminid) {
        throw new Error("Unauthorized Admin!")
    }
    const registeredBusiness = await business.find({ adminid });
    console.log("Business length => " + registeredBusiness.length)
    return registeredBusiness;
}

export const getBusinessDataFromID = async (bid) => {
    if (!bid) {
        throw new Error("business id not found!");
    }

    const businessData = await business.findById(bid);
    return businessData;
}

export const updateBusinessDataService = async (bid, aid, BusinessName, BusinessAddress, BusinessCategory, Country, State, City, pinCode, website, latitude, longitude) => {
    if (!aid) {
        throw new Error("Unauthorized Admin");
    }


    if (latitude == 0 || longitude == 0) {
        const updatedBusiness = await business.findByIdAndUpdate(bid, {
            BusinessName,
            BusinessCategory,
            Country,
            State,
            City,
            pinCode,
            website,
        });
        return updatedBusiness;
    }

    const updatedBusiness = await business.findByIdAndUpdate(bid, {
        BusinessName,
        BusinessAddress,
        BusinessCategory,
        Country,
        State,
        City,
        pinCode,
        website,
        "BusinessCurrentLocation.type": "Point",
        "BusinessCurrentLocation.coordinates": [longitude, latitude],
    });

    return updatedBusiness;
}