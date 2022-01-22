import { ObjectId } from "mongodb";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Log from "../middlewares/Log";
import Order from "../models/Order";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class OrderController extends IController {


    public async index(req: IRequest, res: IResponse) {
        await Token.verify(req, res, async (req, res, auth) => {
            const orders = await Order.find({ uid: auth.uid });
            const response = {
                error: false,
                status: HttpStatusCode.OK,
                path: req.path,
                method: req.method,
                data: orders,
                msg: `get all orders of user success!`
            };
            Log.default(response);
            await res.status(HttpStatusCode.OK).send(response);
        });
    }



    public async show(req: IRequest, res: IResponse) {
        const { oid } = await req.params;
        if (ObjectId.isValid(oid)) {
            await Token.verify(req, res, async (req, res, auth) => {
                const orders = await Order.findOne({ _id: oid, uid: auth.uid });
                if (orders) {
                    const response = {
                        error: false,
                        status: HttpStatusCode.OK,
                        path: req.path,
                        method: req.method,
                        data: orders,
                        msg: `get all orders of user success!`
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.OK).send(response);
                } else {
                    const response = {
                        error: true,
                        status: HttpStatusCode.NOT_FOUND,
                        path: req.path,
                        method: req.method,
                        data: {
                            oid: oid
                        },
                        msg: `not found information of order with oid: ${oid}`
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.NOT_FOUND).send(response);
                }
            });
        } else {
            const response = {
                error: false,
                status: HttpStatusCode.BAD_REQUEST,
                path: req.path,
                method: req.method,
                data: {
                    oid: oid
                },
                msg: `param format wrong! with oid: ${oid}`
            };
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        }

    }



    public create(req: IRequest, res: IResponse) {

    }


    public update(req: IRequest, res: IResponse) {

    }

}

export default new OrderController;