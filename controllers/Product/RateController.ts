import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IBaseResponse from "../../interfaces/vendors/IBaseResponse";
import IController from "../../interfaces/vendors/IController";
import IRequest from "../../interfaces/vendors/IRequest";
import IResponse from "../../interfaces/vendors/IResponse";
import Rate from "../../models/Rate";

class RateController extends IController {

    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { id } = req.params;
        const doc = await Rate.find({ productID: id });
        res.status(200);
        res.send({
            error: false,
            messages: `Rate of product with id: ${id}`,
            data: doc,
            code: 200,
        });
    }
}

export default new RateController;