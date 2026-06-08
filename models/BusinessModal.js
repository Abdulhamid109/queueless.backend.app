import mongoose from "mongoose";


const BusinessModal = new mongoose.Schema({
    adminid:{
        type:String
    },
    BusinessName:{
        type:String,
    },
    BusinessCurrentLocation:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    BusinessAddress:{
        type:String
    },
    //based on the business categories we can set the business fields for them
    // like for healthcare ->different (generally fixed times, also we can say to the patients to be there before 10 mins)
    // for saloons and babershops ->different based on the haircut and beard we can define time / Queue progressiveness
    // Medical Stores and so on,.....
    BusinessCategory:{
        type:String
    },
    Country:{
        type:String
    },
    State:{
        type:String
    },
    City:{
        type:String
    },
    pinCode:{
        type:String
    },
    BusinessGSTIN:{
        type:String
    },
    website:{
        type:String
    },

});

BusinessModal.index({BusinessCurrentLocation:"2dsphere"})

const business = mongoose.models.Business || mongoose.model('Business',BusinessModal);
export default business;