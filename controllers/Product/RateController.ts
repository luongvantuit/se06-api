import { ParamsDictionary } from "express-serve-static-core";
import { ObjectId } from "mongodb";
import { ParsedQs } from "qs";
import CodeError from "../../exception/CodeError";
import ErrorResponse from "../../exception/ErrorResponse";
import HttpStatusCode from "../../exception/HttpStatusCode";
import Token from "../../exception/Token";
import IBaseResponse from "../../interfaces/vendors/IBaseResponse";
import IController from "../../interfaces/vendors/IController";
import IRequest from "../../interfaces/vendors/IRequest";
import IResponse from "../../interfaces/vendors/IResponse";
import Bought from "../../models/Bought";
import Product from "../../models/Product";
import Rate from "../../models/Rate";
import User from "../../models/User";

class RateController extends IController {

    /**
     * 
     * Show all rate in database
     * 
     * @param req 
     * @param res 
     */

    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const docs = await Rate.find();
        return res.status(HttpStatusCode.OK)
            .send({
                error: false,
                message: `All rate records`,
                data: docs,
            })
            .end();
    }

    /**
     * 
     * Show rate of product with ID
     * 
     * @param req 
     * @param res 
     */

    public async show(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { productID } = req.params;
        const docs = await Rate.find({ productID: productID });
        const rate = await Rate.aggregate([
            {
                $match: { productID: productID, }
            },
            {
                $group: {
                    _id: "$productID",
                    average: { $avg: "$rate" }
                }
            }
        ])
        return res.status(HttpStatusCode.OK)
            .send({
                error: false,
                message: `Rate of product with ID: ${productID}`,
                data: {
                    rate: rate.length === 0 ? false : rate[0].average,
                    detail: docs
                },
            })
            .end();
    }

    /**
     * 
     * Store new record in to database
     * 
     * @param req 
     * @param res 
     */

    public async store(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { productID } = await req.params;
        // Valid body property message & rate
        const { message, rate } = await req.body;
        if (message === undefined || rate === undefined)
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    ...ErrorResponse.get(CodeError.BODY_PROPERTY_EMPTY)
                })
                .end();
        // Check rate in body if rate greater than 5 return error
        if (rate > 5)
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    ...ErrorResponse.get(CodeError.PROPERTY_RATE_GREATER_THAN_5)
                })
                .end();
        // Valid product ID
        if (!ObjectId.isValid(productID))
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    ...ErrorResponse.get(CodeError.PARAM_WRONG_FORMAT),
                })
                .end();
    
        return await Token.verify(req, res, async (req, res, auth): Promise<void> => {
            const product = await Product.findById(productID);
            if (product === null)
                return res.status(HttpStatusCode.NOT_FOUND)
                    .send({
                        ...ErrorResponse.get(CodeError.PRODUCT_NOT_FOUND),
                        message: `Not found product with id: ${productID}`
                    })
                    .end();
            // Check information user 
            const user = await User.findOne({ uid: auth.uid });
            if (user === null)
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        ...ErrorResponse.get(CodeError.USER_INFORMATION_EMPTY)
                    })
                    .end();
            const bought = await Bought.find({ productID: productID, userID: user._id });
            if (bought.length === 0)
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        ...ErrorResponse.get(CodeError.PRODUCT_NOT_PURCHASED),
                    })
                    .end();
            // Create new document
            const doc = new Rate({
                userID: user._id,
                productID: productID,
                rate: rate,
                message: message,
                date: Date.now(),
            })
            const result = await doc.save();
            return res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: result,
                    message: `New rate by use for product with id: ${productID}`
                })
                .end();
        })
    }

    /**
     * 
     * Update rate 
     * 
     * @param req 
     * @param res 
     */
    public async update(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {

    }
}

export default new RateController;