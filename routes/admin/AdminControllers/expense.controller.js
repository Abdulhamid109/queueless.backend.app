import { CustomDateExpenseService, DailyExpenseService, OverallExpenseService } from "../AdminServices/expense.service.js";



export const DailyExpenseController = async(req,res)=>{
    try {
        const aid = req.params.aid;
        const bid = req.params.bid;
        const data = await DailyExpenseService(aid,bid);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error},
        )
    }
}

export const OverallExpenseController = async(req,res)=>{
    try {
        const aid = req.params.aid;
        const bid = req.params.bid;
        const data = await OverallExpenseService(aid,bid);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error},
        )
    }
}

export const CustomExpenseController = async(req,res)=>{
    try {
        const aid = req.params.aid;
        const bid = req.params.bid;
        const date = req.query.date;
        const data = await CustomDateExpenseService(aid,bid,date);
        return res.status(200).json(
            {success:true,data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error"+error},
        )
    }
}