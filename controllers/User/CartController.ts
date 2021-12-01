import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import CodeError from "../../exception/CodeError";
import ErrorResponse from "../../exception/ErrorResponse";
import HttpStatusCode from "../../exception/HttpStatusCode";
import Token from "../../exception/Token";
import IBaseResponse from "../../interfaces/vendors/IBaseResponse";
import IController from "../../interfaces/vendors/IController";
import IRequest from "../../interfaces/vendors/IRequest";
import IResponse from "../../interfaces/vendors/IResponse";
import Cart from "../../models/Cart";
import User from "../../models/User";

class CartController extends IController {
    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        return await Token.verify(req, res, async (req, res, auth): Promise<void> => {
            const user = await User.findOne({ uid: auth.uid })
            if (user === null)
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        ...ErrorResponse.get(CodeError.USER_INFORMATION_EMPTY),
                    }).end();
            const cart = Cart.find({ userID: user._id })
            return res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    message: 'Cart for user',
                    data: cart,
                }).end();
        })
    }

    public async store(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { productID } = await req.body;
        if (!productID)
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    ...ErrorResponse.get(CodeError.BODY_PROPERTY_EMPTY),
                }).end();
        return await Token.verify(req, res, async (req, res, auth): Promise<void> => {
            const user = await User.findOne({ uid: auth.uid })
            if (user === null)
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        ...ErrorResponse.get(CodeError.USER_INFORMATION_EMPTY)
                    }).end();
            const doc = new Cart({
                productID: productID,
                userID: user._id,
            })
            const result = await doc.save();
            return res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    message: `Add product with id: ${productID} to cart`,
                    data: result,
                })
                .end();
        })
    }
}

export default new CartController;