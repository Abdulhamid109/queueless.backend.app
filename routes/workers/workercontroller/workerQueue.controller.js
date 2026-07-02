

export const allQueueMemberController =async(req,res)=>{
    try {
        
    } catch (error) {
        res.status(500).json(
            {error:"Internal Service error"+error},
        )
    }
}