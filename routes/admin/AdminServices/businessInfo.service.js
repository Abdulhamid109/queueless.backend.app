import ImageKit from "imagekit";
import dbconnect from "../../../config/dbConfig.js"
import business from "../../../models/BusinessModal.js";
import worker from "../../../models/workermodal.js";
import service from "../../../models/serviceModal.js";
import BusinessTime from "../../../models/TimeModal.js";



var imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

dbconnect();
export const addbusinessData = async (adminid, BusinessName, BusinessAddress, BusinessCategory, Country, State, City, pinCode, website, latitude, longitude, file) => {
    if (!adminid) {
        throw new Error("Unauthorized Admin!")
    }
    if (!BusinessName || !BusinessAddress || !BusinessCategory || !Country || !State || !City || !pinCode || !latitude || !longitude) {
        throw new Error("Values incompleted!")
    }

    if (!file) {
        throw new Error("Business Image not uploaded!")
    }


    const imagekitResponse = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: "/queueless-business"
    })



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
        // "BusinessCurrentLocation.type": "Point",
        // "BusinessCurrentLocation.coordinates": [longitude, latitude],
        BusinessCurrentLocation: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)]
        },
        businessImageLink: imagekitResponse.url
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

export const deleteBusinessService = async(bid)=>{
    if(!bid){
        throw new Error("Business not found!");
    }
    const deletedbusiness = await business.findByIdAndDelete(bid);
    const deleteworkers = await worker.deleteMany({businessId:bid});
    const deleteservices = await service.deleteMany({businessId:bid});
    const deletetime = await BusinessTime.findOneAndDelete({BusinessID:bid});
    return true;
}