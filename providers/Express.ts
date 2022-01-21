import express from "express";
import Kernal from "../middlewares/Kernal";
import Log from "../middlewares/Log";
import HttpStatusCode from "../perform/HttpStatusCode";
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
        this.app.use('*', async function (req, res) {
            const response = {
                error: true,
                path: req.path,
                status: HttpStatusCode.NOT_FOUND,
                method: req.method,
                msg: `not found information api with path: ${req.path}`
            }
            Log.default(response);
            await res.status(HttpStatusCode.NOT_FOUND).send(response);
        })
    }

    public initialization(): void {
        this.app.listen(Locals.config().port, () => { });
    }
}

export default new Express;
