import  {Adminrouter}  from "./admin/index.js";
import  {PrivateAdminRouter}  from "./admin/index.js";
import MaincustomerRouter from "./customer/customerRoutes/auth.route.js";
import { GenCustomerRouter } from "./customer/index.js";
import {PrivateWorkerRouter} from "./workers/index.js"
import {WorkerAuthRouter} from "./workers/index.js"

export {
    Adminrouter,
    MaincustomerRouter,
    GenCustomerRouter,
    PrivateAdminRouter,
    PrivateWorkerRouter,
    WorkerAuthRouter
}