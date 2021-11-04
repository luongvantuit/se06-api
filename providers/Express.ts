import express from 'express'



class Express {

    public app: express.Application;

    constructor() {
        this.app = express();
    }

}

export default new Express;