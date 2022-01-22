import { ObjectId } from "mongodb";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Log from "../middlewares/Log";
import Cart from "../models/Cart";
import Classify from "../models/Classify";
import Order from "../models/Order";
import Product from "../models/Product";
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



    public async create(req: IRequest, res: IResponse) {
        const { data } = await req.body;
        function verifyData(value: any): boolean {
            if (!value || !Array.isArray(value) || value.length === 0) {
                return false;
            }
            for (let index = 0; index < value.length; index++) {
                for (let y = 0; y < index; y++) {
                    if (!ObjectId.isValid(value[index]) || value[index] == value[y]) {
                        return false;
                    }
                }
            }
            return true;
        }
        if (verifyData(data)) {
            await Token.verify(req, res, async (req, res, auth) => {
                const infor = [];
                var amount: number = 0;
                for (let index = 0; index < data.length; index++) {
                    const cid = data[index];
                    const cart = await Cart.findOne({ _id: cid, uid: auth.uid });
                    if (cart) {
                        const product = await Product.findOne({ _id: cart.pid, deleted: false });
                        if (product) {
                            const classify = await Classify.findOne({ _id: cart.classify, deleted: false });
                            if (classify) {
                                if (cart.quantity > classify.quantity) {
                                    const response = {
                                        error: true,
                                        status: HttpStatusCode.BAD_REQUEST,
                                        path: req.path,
                                        method: req.method,
                                        data: {
                                            data: data
                                        },
                                        msg: `the quantity of products is not enough to supply for cart id: ${cid}`
                                    };
                                    Log.default(response);
                                    return await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                                } else {
                                    infor.push({
                                        address: product.address,
                                        displayName: product.displayName,
                                        classify: {
                                            cid: cid,
                                            description: classify.description,
                                            displayName: classify.displayName,
                                            price: classify.price,
                                            quantity: classify.quantity
                                        },
                                        photos: product.photos,
                                        pid: cart.pid,
                                    });
                                    amount += (cart.quantity * classify.price);
                                }
                            } else {
                                const response = {
                                    error: true,
                                    status: HttpStatusCode.BAD_REQUEST,
                                    path: req.path,
                                    method: req.method,
                                    data: {
                                        data: data
                                    },
                                    msg: `not found information classify of product`
                                };
                                Log.default(response);
                                return await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                            }
                        } else {
                            const response = {
                                error: true,
                                status: HttpStatusCode.NOT_FOUND,
                                path: req.path,
                                method: req.method,
                                data: {
                                    data: data
                                },
                                msg: `not found information product`
                            };
                            Log.default(response);
                            return await res.status(HttpStatusCode.NOT_FOUND).send(response);
                        }
                    } else {
                        const response = {
                            error: true,
                            status: HttpStatusCode.NOT_FOUND,
                            path: req.path,
                            method: req.method,
                            data: {
                                data: data
                            },
                            msg: `not found information product in cart with cart id: ${cid}`
                        };
                        Log.default(response);
                        return await res.status(HttpStatusCode.NOT_FOUND).send(response);
                    }
                }
                const order = new Order({
                    uid: auth.uid,
                    status: 'wait-for-confirmation',
                    date: Date.now(),
                    infor: infor,
                    amount: amount
                });
                const error = await order.validateSync();
                if (error) {
                    const response = {
                        error: true,
                        status: HttpStatusCode.BAD_REQUEST,
                        path: req.path,
                        method: req.method,
                        data: {
                            data: data,
                            error: error
                        },
                        msg: `body property format wrong!`
                    };
                    Log.default(response);
                    return await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                } else {
                    for (let index = 0; index < data.length; index++) {
                        const cid = data[index];
                        const cart = await Cart.findOne({ _id: cid, uid: auth.uid });
                        if (cart) {
                            const classify = await Classify.findOne({ _id: cart.classify, deleted: false });
                            if (classify) {
                                classify.quantity = classify.quantity - cart.quantity;
                                await classify.save();
                            }
                            await cart.delete();
                        }
                    }
                    const resOrder = await order.save();
                    const reponse = {
                        error: false,
                        status: HttpStatusCode.OK,
                        path: req.path,
                        method: req.method,
                        data: resOrder,
                        msg: `order product success!`,
                    }
                    Log.default(reponse);
                    return await res.status(HttpStatusCode.OK).send(reponse);
                }
            })
        } else {
            const response = {
                error: true,
                status: HttpStatusCode.BAD_REQUEST,
                path: req.path,
                method: req.method,
                data: {
                    data: data
                },
                msg: `body property format wrong!`
            };
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        }
    }


    // public update(req: IRequest, res: IResponse) {

    // }

}

export default new OrderController;