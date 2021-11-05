import { Application } from "express";

class CRSFToken {
    public mount(_express: Application): Application {
        return _express;
    }
}

export default new CRSFToken;