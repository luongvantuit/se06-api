import { ParamsDictionary } from "express-serve-static-core";
import { ObjectId } from "mongodb";
import { ParsedQs } from "qs";
import HttpStatusCode from "../../interfaces/vendors/HttpStatusCode";
import IBaseResponse from "../../interfaces/vendors/IBaseResponse";
import IController from "../../interfaces/vendors/IController";
import IRequest from "../../interfaces/vendors/IRequest";
import IResponse from "../../interfaces/vendors/IResponse";
import Product from "../../models/Product";
import Rate from "../../models/Rate";
import User from "../../models/User";
import Firebase from "../../services/auths/Firebase";

class RateController extends IController {

    /**
     * 
     * Show all rate in database
     * 
     * @param req 
     * @param res 
     */

    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const doc = await Rate.find();
        return res.status(HttpStatusCode.OK)
            .send({
                error: false,
                message: `All rate records`,
                data: doc,
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
        const doc = await Rate.find({ productID: productID });
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
                    detail: doc
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
        const token = req.headers['token'];
        // Check null token in header if null return state unauthorized
        if (token === undefined)
            return res.status(HttpStatusCode.UNAUTHORIZED)
                .send({
                    error: true,
                    message: "Unauthorized! Header token is empty",
                })
                .end();
        try {
            // Valid ID Token form header
            const user = await Firebase.auth().verifyIdToken(token.toString(), true);
            const { productID } = req.params;
            // Valid body property message & rate
            const { message, rate } = req.body;
            if (message === undefined || rate === undefined)
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        error: true,
                        message: "Property message & rate not is empty",
                    })
                    .end();
            // Check rate in body if rate greater than 5 return error
            if (rate > 5)
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        error: true,
                        message: "Property rate not greater than 5"
                    })
                    .end();
            // Valid product ID
            if (!ObjectId.isValid(productID))
                return res.status(HttpStatusCode.NOT_FOUND)
                    .send({
                        error: true,
                        message: `Not found product with ID: ${productID}`
                    })
                    .end();
            // Find product by ID if product is existed status code = 404
            const product = await Product.findById(productID);
            if (product === null)
                return res.status(HttpStatusCode.NOT_FOUND)
                    .send({
                        error: true,
                        message: `Not found product with id: ${productID}`
                    })
                    .end();
            // Check information user 
            const docUser = await User.findOne({ uid: user.uid })
            if (!docUser)
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        error: true,
                        message: "User has not updated information"
                    })
                    .end();
            // Create new document
            const doc = new Rate({
                userID: docUser._id,
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
        }
        catch (error: any) {
            // Send error & status code unauthorized if ID token verify error
            return res.status(HttpStatusCode.UNAUTHORIZED)
                .send({
                    error: true,
                    message: error.message,
                })
                .end();
        }
    }


    public async update(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        
    }
}

export default new RateController;