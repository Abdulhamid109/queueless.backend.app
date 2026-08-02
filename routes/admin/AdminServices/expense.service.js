import dbconnect from "../../../config/dbConfig.js";
import queue from "../../../models/QueueModal.js";
import service from "../../../models/serviceModal.js";



dbconnect();

export const DailyExpenseService=async(aid,bid)=>{
    if(!aid){
        throw new Error("Unauthorized Admin")
    }
    if(!bid){
        throw new Error("No associated busines found")
    }
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US');
    const QueueDB = await queue.findOne({businessId:bid,date:currentDate});
    if(!QueueDB){
        throw new Error("Empty Queue");
    }
    const serviceids = await QueueDB.ServiceId;
    const currentDayEarnings = await Promise.all(
        serviceids.map(async(sid)=>{
            const serviceDB = await service.findById(sid);
            return Number(serviceDB.ChargesPerService);
        })
    )

    return currentDayEarnings.reduce((sum,val)=>sum+val ,0);
}

export const OverallExpenseService = async (aid, bid) => {
    if (!aid) {
        throw new Error("Unauthorized Admin");
    }
    if (!bid) {
        throw new Error("No associated business found");
    }

    const QueueDB = await queue.find({ businessId: bid });
    if (!QueueDB || QueueDB.length === 0) {
        throw new Error("Empty Queue");
    }

    const serviceIds = QueueDB.flatMap((q) => q.ServiceId);

    const allEarnings = await Promise.all(
        serviceIds.map(async (sid) => {
            const serviceDB = await service.findById(sid);
            return Number(serviceDB.ChargesPerService);
        })
    );

    return allEarnings.reduce((sum, val) => sum + val, 0);
};

export const CustomDateExpenseService = async(aid,bid,date)=>{
    if(!aid){
        throw new Error("Unauthorized Admin")
    }
    if(!bid){
        throw new Error("No associated busines found")
    }

    const QueueDB = await queue.findOne({businessId:bid,date:date});
    if(!QueueDB){
        throw new Error("Empty Queue");
    }
    const serviceids = await QueueDB.ServiceId;
    const currentDayEarnings = await Promise.all(
        serviceids.map(async(sid)=>{
            const serviceDB = await service.findById(sid);
            return Number(serviceDB.ChargesPerService);
        })
    )

    return currentDayEarnings.reduce((sum,val)=>sum+val ,0);
}