import express from 'express'
import Log from '../middlewares/Log';
import Locals from './Locals';
import Routes from './Routes';


class Express {

    private app: express.Application;

    constructor() {
        this.app = express();
        this.mountDotENV();
        this.mountRoutes();
    }

    public mountDotENV(): void {
        this.app = Locals.initialization(this.app)
    }


    public mountRoutes(): void {
        this.app = Routes.mountAPI(this.app);
        this.app = Routes.mountWeb(this.app);
    }


    public initialization(): void {
        this.app.listen(
            Locals.config().port,
            () => {
                Log.default("Initialzation Server, Success!")
            }
        )
    }

}

export default new Express;