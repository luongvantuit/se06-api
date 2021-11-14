import IRequest from "../../interfaces/vendors/IRequest";
import IResponse from "../../interfaces/vendors/IResponse";
import * as path from 'path';
import Database from "../../providers/Database";
import Log from "../../middlewares/Log";

class WelcomeController {

    public async index(req: IRequest, res: IResponse): Promise<void> {
        await Database.client.db('data').collection('test').insertOne({
            test: "Hello"
        })
        const e: number = await Database.client.db('data').collection('test').countDocuments()
        Log.default(e)
        res.sendFile(path.join(__dirname, "../../resources/views/welcome.html"));
    }
}

export default new WelcomeController;