import { AfterJoinWork } from "./functions/afterJoinQueueArch";
import { RebalanceQueue } from "./functions/rebalancingQueue";


export const functions = [AfterJoinWork,RebalanceQueue]