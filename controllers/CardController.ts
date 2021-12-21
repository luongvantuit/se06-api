import { ParamsDictionary } from "express-serve-static-core";
import { ObjectId } from "mongodb";
import { ParsedQs } from "qs";
import IBaseResponse from "../interfaces/vendors/IBaseResponse";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Card from "../models/Card";
import CodeResponse from "../perform/CodeResponse";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class CardController extends IController {
    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        return await Token.verify(req, res, async (req, res, auth) => {
            const cards = await Card.find({ uid: auth.uid })
            return res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: cards,
                })
                .end();
        });
    }

    public async create(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        return await Token.verify(req, res, async (req, res, auth) => {
            const cards = await Card.find({ uid: auth.uid })

        });
    }

    public edit(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): void {

    }

    public async destroy(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        const { cid } = await req.params;
        if (!ObjectId.isValid(cid))
            return await res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    error: true,
                    code: CodeResponse.PARAM_WRONG_FORMAT,
                })
                .end();
        return await Token.verify(req, res, async (req, res, auth) => {
            const card = await Card.findOne({
                uid: auth.uid,
                _id: cid,
            });
            if (card === null)
                return await res.status(HttpStatusCode.NOT_FOUND)
                    .send({
                        error: true,
                        code: CodeResponse.CARD_NOT_FOUND,
                    })
                    .end();
            else {
                const oldCard = await card.delete();
                return await res.status(HttpStatusCode.OK)
                    .send({
                        error: false,
                        data: oldCard,
                    })
                    .end();
            }
        });
    }

    public async show(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { cid } = await req.params;
        if (!ObjectId.isValid(cid))
            return await res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    error: true,
                    code: CodeResponse.PARAM_WRONG_FORMAT,
                })
                .end();
        return await Token.verify(req, res, async (req, res, auth) => {
            const card = await Card.findOne({
                uid: auth.uid,
                _id: cid,
            });
            if (card === null)
                return await res.status(HttpStatusCode.NOT_FOUND)
                    .send({
                        error: true,
                        code: CodeResponse.CARD_NOT_FOUND,
                    })
                    .end();
            else {
                return await res.status(HttpStatusCode.OK)
                    .send({
                        error: false,
                        data: card,
                    })
                    .end();
            }
        });
    }
}

export default new CardController;