import express from "express";
import Kernal from "../middlewares/Kernal";
import Locals from "./Locals";
import Routes from "./Routes";

class Express {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.mountDotENV();
    this.mountMiddlewares();
    this.mountRoutes();
  }

  private mountDotENV(): void {
    this.app = Locals.initialization(this.app);
  }

  private mountMiddlewares(): void {
    this.app = Kernal.initialization(this.app);
  }

  private mountRoutes(): void {
    this.app = Routes.mountAPI(this.app);
    this.app = Routes.mountWeb(this.app);
  }

  public initialization(): void {
    this.app.listen(Locals.config().port, () => {});
  }
}

export default new Express();
