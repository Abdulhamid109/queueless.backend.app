import dbconnect from "../../../config/dbConfig.js"
import SfeedBack from "../../../models/SystemFeedBack.js"




dbconnect();
export const addSystemFeedbackData = async(Title,Description)=>{
    if(!Title || !Description){
        throw new Error("Empty Values are not accepted!")
    }
    const newSystemFeedback = new SfeedBack({
        Title,
        Description
    });
    const savedFeedBack = await newSystemFeedback.save();
    return savedFeedBack;
}