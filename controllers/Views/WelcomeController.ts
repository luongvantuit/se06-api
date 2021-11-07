import IRequest from "../../interfaces/vendors/IRequest";
import IResponse from "../../interfaces/vendors/IResponse";
import * as path from 'path';

class WelcomeController {
    public index(req: IRequest, res: IResponse): void {
        res.sendFile(path.join(__dirname, "../../resources/views/welcome.html"));
    }
}

export default new WelcomeController;