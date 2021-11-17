import { Application } from "express";
import API from "../routes/API";
import Web from "../routes/Web";
import Locals from "./Locals";

class Routers {

    public mountAPI(_express: Application): Application {
        return _express.use(Locals.config().APIPrefix, API);
    }

    public mountWeb(_express: Application): Application {
        return _express.use("/", Web);
    }
}

export default new Routers;
