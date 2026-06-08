import mongoose from "mongoose";


const ContactModal = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    subject:{
        type:String
    },
    message:{
        type:String
    }
});

const contact = await mongoose.models.Contact || mongoose.model('Contact',ContactModal);
export default contact;