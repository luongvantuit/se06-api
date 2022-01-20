import { ObjectId } from "mongodb";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Product from "../models/Product";
import Shop from "../models/Shop";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class ProductController extends IController {

    public async index(req: IRequest, res: IResponse) {
        const {
            sid
        } = await req.params;
        const {
            limit,
            page,
            category
        } = await req.query;
        const mLimit: number = Number(limit ?? 0);
        const mPage: number = Number(page ?? 0);
        if (!sid) {
            if (!category) {
                const products = await Product.find().skip(mLimit * mPage).limit(mLimit);
                const countDocuments: number = await Product.countDocuments();
                const maxPage: number = Math.ceil(countDocuments / mLimit);
                await res.status(HttpStatusCode.OK).send({
                    error: false,
                    data: products,
                    maxPage: maxPage,
                });
            } else {
                const products = await Product.aggregate([
                    {
                        $match: {
                            classifies: {
                                "$elemMatch": {
                                    "$eq": category,
                                }
                            }
                        },
                        $skip: mLimit * mPage,
                        $limit: mLimit,
                    },
                ]);
                const allProducts = await Product.aggregate([
                    {
                        $match: {
                            classifies: {
                                "$elemMatch": {
                                    "$eq": category,
                                }
                            }
                        },
                    },
                ]);
                const countDocuments: number = allProducts.length;
                const maxPage: number = Math.ceil(countDocuments / mLimit);
                await res.status(HttpStatusCode.OK).send({
                    error: false,
                    data: products,
                    maxPage: maxPage,
                });
            }
        }
        else {
            if (!category) {
                const products = await Product.find({ sid: sid }).skip(mLimit * mPage).limit(mLimit);
                const countDocuments: number = products.length;
                const maxPage: number = Math.ceil(countDocuments / mLimit);
                await res.status(HttpStatusCode.OK).send({
                    error: false,
                    data: products,
                    maxPage: maxPage,
                });
            } else {
                const products = await Product.aggregate([
                    {
                        $match: {
                            classifies: {
                                "$elemMatch": {
                                    "$eq": category,
                                }
                            },
                            sid: sid
                        },
                        $skip: mLimit * mPage,
                        $limit: mLimit,
                    },
                ]);
                const allProducts = await Product.aggregate([
                    {
                        $match: {
                            classifies: {
                                "$elemMatch": {
                                    "$eq": category,
                                }
                            },
                            sid: sid
                        },
                    },
                ]);
                const countDocuments: number = allProducts.length;
                const maxPage: number = Math.ceil(countDocuments / mLimit);
                await res.status(HttpStatusCode.OK).send({
                    error: false,
                    data: products,
                    maxPage: maxPage,
                });
            }
        }
    }

    public async create(req: IRequest, res: IResponse) {
        const { sid } = await req.params;
        const {
            description,
            displayName,
            photos,
            address,
            classifies,
            categories,
        } = await req.body;
        if (!ObjectId.isValid(sid)) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
            });
        } else {
            if (classifies && Array.isArray(classifies) && classifies.length > 0) {
                await Token.verify(req, res, async (req, res, auth) => {
                    const shop = await Shop.findById(sid);
                    if (!shop || shop.uid !== auth.uid) {
                        await res.status(HttpStatusCode.NOT_FOUND).send({
                            error: true,
                        });
                    } else {
                        const product = new Product({
                            sid: sid,
                            description: description,
                            displayName: displayName,
                            photos: photos,
                            address: address,
                            classifies: classifies,
                            categories: categories,
                            date: Date.now(),
                        })
                        const error = await product.validateSync();
                        if (!error) {
                            var quantily = 0;
                            for (let index = 0; index < product.classifies.length; index++) {
                                quantily += product.classifies[index].quantily;
                            }
                            if (quantily > 0) {
                                product.state = 'in-stock';
                            } else {
                                product.state = 'out-of-stock';
                            }
                            const newProduct = await product.save();
                            await res.status(HttpStatusCode.OK).send({
                                error: false,
                                data: newProduct,
                            });
                        } else {
                            await res.status(HttpStatusCode.BAD_REQUEST).send({
                                error: true,
                                data: error,
                            });
                        }
                    }
                });
            } else {
                await res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                });
            }
        }
    }

    public async destroy(req: IRequest, res: IResponse) {
        const { sid, pid } = await req.params;
        if (!ObjectId.isValid(sid) || !ObjectId.isValid(pid)) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
            });
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const shop = await Shop.findById(sid);
                if (!shop || shop.uid !== auth.uid) {
                    await res.status(HttpStatusCode.NOT_FOUND).send({
                        error: true,
                    });
                } else {
                    const product = await Product.findById(pid);
                    if (!product) {
                        await res.status(HttpStatusCode.NOT_FOUND).send({
                            error: true,
                        });
                    } else {
                        const oldProduct = await product.delete();
                        await res.status(HttpStatusCode.OK).send({
                            error: false,
                            data: oldProduct,
                        });
                    }
                }
            });
        }
    }

    public async update(req: IRequest, res: IResponse) {
        const { sid, pid } = await req.params;
        const {
            description,
            displayName,
            photos,
            address,
            classifies,
            categories,
            state,
        } = await req.body;

        if (!ObjectId.isValid(sid) || !ObjectId.isValid(pid)) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
            });
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const shop = await Shop.findById(sid);
                if (!shop || shop.uid !== auth.uid) {
                    await res.status(HttpStatusCode.NOT_FOUND).send({
                        error: true,
                    });
                } else {
                    const product = await Product.findById(pid);
                    if (!product) {
                        await res.status(HttpStatusCode.NOT_FOUND).send({
                            error: true,
                        });
                    } else {
                        product.description = description ?? product.description;
                        product.displayName = displayName ?? product.displayName;
                        product.photos = photos ?? product.photos;
                        product.address = address ?? product.address;
                        product.classifies = (classifies && Array.isArray(classifies) && classifies.length > 0) ? classifies : product.classifies;
                        product.categories = categories ?? product.categories;
                        product.state = state ?? product.state;
                        const error = await product.validateSync();
                        if (!error) {
                            var quantily = 0;
                            for (let index = 0; index < product.classifies.length; index++) {
                                quantily += product.classifies[index].quantily;
                            }
                            if (quantily > 0) {
                                product.state = 'in-stock';
                            } else {
                                product.state = 'out-of-stock';
                            }
                            const newProduct = await product.save();
                            await res.status(HttpStatusCode.OK).send({
                                error: false,
                                data: newProduct,
                            });
                        } else {
                            await res.status(HttpStatusCode.OK).send({
                                error: false,
                                data: error,
                            });
                        }
                    }
                }
            });
        }
    }

    public async show(req: IRequest, res: IResponse) {
        const { pid } = await req.params;
        if (!ObjectId.isValid(pid)) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
            });
        } else {
            const product = await Product.findById(pid);
            if (!product) {
                await res.status(HttpStatusCode.NOT_FOUND).send({
                    error: true,
                });
            } else {
                await res.status(HttpStatusCode.OK).send({
                    error: false,
                    data: product
                });
            }
        }
    }
}


export default new ProductController;