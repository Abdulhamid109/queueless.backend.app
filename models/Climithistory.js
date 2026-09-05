import mongoose from "mongoose";


const customerlimithistory = new mongoose.Schema({
    customercomplimit:{
        type:Number
    },
    bid:{
        type:String
    },
    date:{
        type:String
    }
});

const Climit = mongoose.models.CustLimit || mongoose.model("CustLimit",customerlimithistory);
export default Climit;