import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IBaseResponse from "../../interfaces/vendors/IBaseResponse";
import IController from "../../interfaces/vendors/IController";
import IRequest from "../../interfaces/vendors/IRequest";
import IResponse from "../../interfaces/vendors/IResponse";
import Rate from "../../models/Rate";

class RateController extends IController {

    /**
     * 
     * Show all rate in database
     * 
     * @param req 
     * @param res 
     */

    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { id } = req.params;
        const doc = await Rate.find();
        res.send({
            error: false,
            messages: `All rate records`,
            data: doc,
        });
    }

    /**
     * 
     * Show rate of product with ID
     * 
     * @param req 
     * @param res 
     */

    public async show(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { id } = req.params;
        const doc = await Rate.find({ productID: id });
        const rate = await Rate.aggregate([
            {
                $match: { productID: id, }
            },
            {
                $group: {
                    _id: "$productID",
                    average: { $avg: "$rate" }
                }
            }
        ])
        res.send({
            error: false,
            messages: `Rate of product with id: ${id}`,
            data: {
                rate: rate.length ?? rate[0].average,
                detail: doc
            },
        });
    }

    /**
     * 
     * Store new record in to database
     * 
     * @param req 
     * @param res 
     */

    public async store(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        res.end();
    }
}

export default new RateController;