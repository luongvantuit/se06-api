import { ObjectId } from "mongodb";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Cart from "../models/Cart";
import CodeResponse from "../perform/CodeResponse";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class CartController extends IController {
    public index(req: IRequest, res: IResponse) {

    }


    public async destroy(req: IRequest, res: IResponse) {
        const { cid } = await req.params;
        await Token.verify(req, res, async (req, res, auth) => {
            if (!ObjectId.isValid(cid)) {
                await res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                    code: CodeResponse.PARAM_WRONG_FORMAT
                });
            } else {
                const cart = await Cart.findOne({ _id: cid });
                if (!cart || auth.uid !== cart.uid) {
                    await res.status(HttpStatusCode.BAD_REQUEST).send({
                        error: true,
                        code: CodeResponse.PRODUCT_NOT_FOUND
                    });
                } else {
                    const old = await cart.delete();
                    await res.status(HttpStatusCode.OK).send({
                        error: false,
                        data: old
                    });
                }
            }
        });
    }
}



export default new CartController;