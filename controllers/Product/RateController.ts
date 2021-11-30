import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IController from "../../interfaces/vendors/IController";
import IRequest from "../../interfaces/vendors/IRequest";
import IResponse from "../../interfaces/vendors/IResponse";
import Rate from "../../models/Rate";

class RateController extends IController {

    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        const { id } = req.params;
        const doc = await Rate.find({ productID: id });
        res.send(JSON.stringify(doc));
    }
}

export default new RateController;