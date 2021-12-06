import { ParamsDictionary } from "express-serve-static-core";
import { ObjectId } from "mongodb";
import { ParsedQs } from "qs";
import CodeError from "../../exception/CodeError";
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

    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const docs = await Rate.find();
        return res.status(HttpStatusCode.OK)
            .send({
                error: false,
                data: docs,
            })
            .end();
    }

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
                    average: { $avg: "$rateCurrency" }
                }
            }
        ])
        return res.status(HttpStatusCode.OK)
            .send({
                error: false,
                data: {
                    rate: rate.length === 0 ? false : rate[0].average,
                    detail: docs
                },
            })
            .end();
    }

    public async store(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { productID } = await req.params;
        const { message, rate } = await req.body;


        if (message === undefined || rate === undefined)
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    code: CodeError.BODY_PROPERTY_EMPTY,
                    error: true,
                })
                .end();


        if (rate > 5)
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    code: CodeError.PROPERTY_RATE_GREATER_THAN_5,
                    error: true,
                })
                .end();


        if (!ObjectId.isValid(productID))
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    code: CodeError.PARAM_WRONG_FORMAT,
                    error: true,
                })
                .end();

        return await Token.verify(req, res, async (req, res, auth): Promise<void> => {

            const product = await Product.findById(productID);

            if (product === null)
                return res.status(HttpStatusCode.NOT_FOUND)
                    .send({
                        code: CodeError.PRODUCT_NOT_FOUND,
                        error: true,
                    })
                    .end();


            const user = await User.findOne({ uid: auth.uid });
            if (user === null)
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        code: CodeError.USER_INFORMATION_EMPTY,
                        error: true,
                    })
                    .end();

            const bought = await Bought.find({ productID: productID, userID: user._id });
            if (bought.length === 0)
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        code: CodeError.PRODUCT_NOT_PURCHASED,
                        error: true,
                    })
                    .end();

            const oldRate = await Rate.findOne({
                userId: auth.uid,
            })
            if (oldRate === null)
                return this.update(req, res);
            const doc = new Rate({
                userId: user._id,
                productId: productID,
                rateCurrency: rate,
                rates: [
                    {
                        rate: rate,
                        msg: message,
                        date: Date.now()
                    }
                ]
            })

            const result = await doc.save();
            return res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: result,
                })
                .end();
        })
    }

    public async update(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {

    }
}

export default new RateController;