import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import HttpStatusCode from "../../interfaces/vendors/HttpStatusCode";
import IBaseResponse from "../../interfaces/vendors/IBaseResponse";
import IController from "../../interfaces/vendors/IController";
import IRequest from "../../interfaces/vendors/IRequest";
import IResponse from "../../interfaces/vendors/IResponse";
import Cart from "../../models/Cart";
import User from "../../models/User";
import Firebase from "../../services/auths/Firebase";

class CartController extends IController {
    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { token } = await req.headers;
        if (!token)
            return res.status(HttpStatusCode.UNAUTHORIZED)
                .send({
                    error: true,
                    message: 'Unauthorized! Header token is empty',
                }).end();
        try {
            const auth = await Firebase.auth().verifyIdToken(token.toString());
            const user = await User.findOne({ uid: auth.uid })
            if (user === null)
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        error: true,
                        message: 'User has not updated information',
                    }).end();
            const cart = Cart.find({ userID: user._id })
            return res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    message: 'Cart for user',
                    data: cart,
                }).end();
        } catch (error: any) {
            return res.status(HttpStatusCode.UNAUTHORIZED)
                .send({
                    error: true,
                    message: error.message,
                }).end();
        }
    }

    public async store(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { token } = await req.headers;
        const { productID } = await req.body;
        if (!token)
            return res.status(HttpStatusCode.UNAUTHORIZED)
                .send({
                    error: true,
                    message: 'Unauthorized! Header token is empty',
                }).end();
        if (!productID)
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    error: true,
                    message: 'Property productID is empty',
                }).end();
        try {
            const auth = await Firebase.auth().verifyIdToken(token.toString());
            const user = await User.findOne({ uid: auth.uid })
            if (user === null)
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        error: true,
                        message: 'User has not updated information',
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
        } catch (error: any) {
            return res.status(HttpStatusCode.UNAUTHORIZED)
                .send({
                    error: true,
                    message: error.message,
                }).end();
        }
    }
}

export default new CartController;