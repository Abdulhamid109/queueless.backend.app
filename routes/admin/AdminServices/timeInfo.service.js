import dbconnect from "../../../config/dbConfig.js"
import BusinessTime from "../../../models/TimeModal.js";



dbconnect();
export const addtimeData = async(BusinessID,BST,BET,CustomerLimitPerDay,AdditionalInformation)=>{
    if(!BusinessID){
        throw new Error("No associated business found");
    }
    if(!BST || !BET || !CustomerLimitPerDay){
        throw new Error("Empty Field are not allowed!")
    }

    const newtimeData = new BusinessTime({
        BusinessID,
        BST,
        BET,
        CustomerLimitPerDay,
        AdditionalInformation
    });

    const savedTimeData = await newtimeData.save();
    return true;
}

export const gettimeData = async(BusinessID)=>{
    if(!BusinessID){
        throw new Error("No associated business found");
    }

    const timeData = await BusinessTime.findOne({BusinessID});
    return timeData;
}

export const updateTimeData = async(tid,BST,BET,CustomerLimitPerDay,AdditionalInformation)=>{
    if(!tid){
        throw new Error("Invalid time id");
    }
    const UpdatetimeDB = await BusinessTime.findByIdAndUpdate(tid,{
        BST,
        BET,
        CustomerLimitPerDay,
        AdditionalInformation
    })
}