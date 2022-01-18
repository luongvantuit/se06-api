import { ObjectId } from "mongodb";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Card, { ICard } from "../models/Card";
import CodeResponse from "../perform/CodeResponse";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class CardController extends IController {
    public async index(req: IRequest, res: IResponse) {
        await Token.verify(req, res, async (req, res, auth) => {
            const cards = await Card.find({ uid: auth.uid })
            const responseCards: Array<{ _id: string } & ICard> = [];
            for (let index = 0; index < cards.length; index++) {
                responseCards.push({
                    cardNumber: cards[index].cardNumber.substring(0, 3),
                    ownerName: cards[index].ownerName,
                    _id: cards[index]._id.toString(),
                });
            }
            res.status(HttpStatusCode.OK).send({
                error: false,
                data: responseCards,
            });
        });
    }

    public async create(req: IRequest, res: IResponse) {
        const {
            cardNumber,
            cvv,
            ownerName,
        } = await req.body;
        await Token.verify(req, res, async (req, res, auth) => {
            if (!cardNumber) {
                res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                    code: CodeResponse.BODY_PROPERTY_EMPTY
                });
            } else {
                const card = await Card.findOne({ uid: auth.uid, cardNumber: cardNumber });
                if (card !== null) {
                    res.status(HttpStatusCode.OK).send({
                        error: true,
                        code: CodeResponse.METHOD_REQUEST_WRONG
                    });
                } else {
                    const nCard = new Card({
                        cardNumber: cardNumber,
                        cvv: cvv,
                        ownerName: ownerName,
                        uid: auth.uid,
                    })
                    const error = await nCard.validateSync();
                    if (error !== null) {
                        res.status(HttpStatusCode.BAD_REQUEST).send({
                            error: true,
                            code: CodeResponse.BODY_PROPERTY_WRONG_FORMAT,
                            data: error,
                        });
                    } else {
                        const rCard = await nCard.save();
                        const responseCard: { _id: string } & ICard = {
                            cardNumber: rCard.cardNumber.substring(0, 3),
                            ownerName: rCard.ownerName,
                            _id: rCard._id.toString(),
                        }
                        res.status(HttpStatusCode.OK).send({
                            error: false,
                            data: responseCard,
                        });
                    }
                }
            }
        });
    }

    public async edit(req: IRequest, res: IResponse) {
        const {
            cardNumber,
            cvv,
            ownerName,
        } = await req.body;
        await Token.verify(req, res, async (req, res, auth) => {
            if (!cardNumber) {
                res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                    code: CodeResponse.BODY_PROPERTY_EMPTY
                });
            } else {
                const oCard = await Card.findOne({ uid: auth.uid, cardNumber: cardNumber });
                if (oCard === null) {
                    res.status(HttpStatusCode.OK).send({
                        error: true,
                        code: CodeResponse.CARD_NOT_FOUND
                    });
                } else {
                    oCard.cardNumber = cardNumber ?? oCard.cardNumber;
                    oCard.cvv = cvv ?? oCard.cvv;
                    oCard.ownerName = ownerName ?? oCard.ownerName;
                    const error = await oCard.validateSync();
                    if (error !== null) {
                        res.status(HttpStatusCode.BAD_REQUEST).send({
                            error: true,
                            code: CodeResponse.BODY_PROPERTY_WRONG_FORMAT,
                            data: error,
                        });
                    } else {
                        const rCard = await oCard.save();
                        const responseCard: { _id: string } & ICard = {
                            cardNumber: rCard.cardNumber.substring(0, 3),
                            ownerName: rCard.ownerName,
                            _id: rCard._id.toJSON(),
                        }
                        res.status(HttpStatusCode.OK).send({
                            error: false,
                            data: responseCard,
                        });
                    }
                }
            }
        });
    }

    public async destroy(req: IRequest, res: IResponse) {
        const { cid } = await req.params;
        if (!ObjectId.isValid(cid)) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
                code: CodeResponse.PARAM_WRONG_FORMAT,
            });
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const card = await Card.findOne({
                    uid: auth.uid,
                    _id: cid,
                });
                if (card === null) {
                    await res.status(HttpStatusCode.NOT_FOUND).send({
                        error: true,
                        code: CodeResponse.CARD_NOT_FOUND,
                    });
                } else {
                    const oldCard = await card.delete();
                    const responseCard: { _id: string } & ICard = {
                        cardNumber: oldCard.cardNumber.substring(0, 3),
                        ownerName: oldCard.ownerName,
                        _id: oldCard._id.toString(),
                    }
                    await res.status(HttpStatusCode.OK).send({
                        error: false,
                        data: responseCard,
                    });
                }
            });
        }
    }

    public async show(req: IRequest, res: IResponse) {
        const { cid } = await req.params;
        if (!ObjectId.isValid(cid)) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
                code: CodeResponse.PARAM_WRONG_FORMAT,
            });
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const card = await Card.findOne({
                    uid: auth.uid,
                    _id: cid,
                });
                if (card === null) {
                    await res.status(HttpStatusCode.NOT_FOUND).send({
                        error: true,
                        code: CodeResponse.CARD_NOT_FOUND,
                    });
                } else {
                    const responseCard: { _id: string } & ICard = {
                        cardNumber: card.cardNumber.substring(0, 3),
                        ownerName: card.ownerName,
                        _id: card._id.toString(),
                    }
                    await res.status(HttpStatusCode.OK).send({
                        error: false,
                        data: responseCard,
                    });
                }
            });
        }
    }
}

export default new CardController;