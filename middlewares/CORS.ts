import { Application } from "express";
import * as cors from "cors";
import Locals from "../providers/Locals";

class CORS {
  public mount(_express: Application): Application {
    const option: cors.CorsOptions = {
      optionsSuccessStatus: 200,
      origin: Locals.config().URL,
    };

    _express = _express.use(cors.default(option));

    return _express;
  }
}

export default new CORS();
