import { Application } from "express";

class Http {
  public mount(_express: Application): Application {
    return _express;
  }
}

export default new Http();
