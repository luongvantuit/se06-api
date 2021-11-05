import { Application } from "express";
import Locals from "../providers/Locals";
import CORS from "./CORS";
import CRSFToken from "./CRSFToken";
import Http from "./Http";
import Statics from "./Statics";
import Views from "./Views";

class Kernal {
  public initialization(_express: Application): Application {
    if (Locals.config().isCORSEnable) _express = CORS.mount(_express);

    _express = CRSFToken.mount(_express);

    _express = Http.mount(_express);

    _express = Statics.mount(_express);

    _express = Views.mount(_express);

    return _express;
  }
}

export default new Kernal();
