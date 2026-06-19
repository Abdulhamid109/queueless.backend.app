import mongoose from "mongoose";


const CustomerModal = new mongoose.Schema({
    role:{
        type:String,
        default:"user"
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:String,
    },
    CustomerCurrentLocation:{
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
    CustomerAddress:{
        type:String
    },
    activeQueues: [
    {
        businessId: { type: String, ref: 'Business' },
        queueId:    { type: String, ref: 'queue' },
        date:String
    }
],
    LiveLatitude:{
        type:String
    },
    LiveLongitude:{
        type:String
    },
    FlexibleTiming:{
        type:Boolean
    }

});

// CustomerModal.index({CustomerCurrentLocation:"2dsphere"})

const customer = mongoose.models.customer || mongoose.model('customer',CustomerModal);
export default customer;