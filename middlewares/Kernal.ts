import { Application } from "express";
import Views from "./Views";

class Kernal {
    public initialization(_express: Application): Application {
        _express = Views.mount(_express);
        return _express;
    }
}

export default new Kernal;