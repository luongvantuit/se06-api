import IRequest from "../../interfaces/vendors/IRequest";
import IResponse from "../../interfaces/vendors/IResponse";
import * as path from 'path';

class WelcomeController {

    public async index(req: IRequest, res: IResponse): Promise<void> {
        res.render('welcome')
    }
}

export default new WelcomeController;