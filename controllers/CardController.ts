import { ObjectId } from "mongodb";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Log from "../middlewares/Log";
import Card, { ICard } from "../models/Card";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class CardController extends IController {

    public async index(req: IRequest, res: IResponse) {
        await Token.verify(req, res, async (req, res, auth) => {
            const cards = await Card.find({ uid: auth.uid })
            const responseCards: Array<{ _id: string } & ICard> = [];
            for (let index = 0; index < cards.length; index++) {
                responseCards.push({
                    cardNumber: `${cards[index].cardNumber.substring(0, 3)} *** ****`,
                    ownerName: cards[index].ownerName,
                    _id: cards[index]._id.toString(),
                });
            }
            const response: any = {
                error: false,
                data: responseCards,
                status: HttpStatusCode.OK,
                path: req.path,
                method: req.method,
                msg: 'success! get information cards of user'
            };
            Log.default(response)
            await res.status(HttpStatusCode.OK).send(response);
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
                const response: any = {
                    error: true,
                    data: {
                        cardNumber: cardNumber,
                    },
                    status: HttpStatusCode.BAD_REQUEST,
                    path: req.path,
                    method: req.method,
                    msg: `body property card number is empty`
                };
                Log.default(response);
                await res.status(HttpStatusCode.BAD_REQUEST).send(response);
            } else {
                const card = await Card.findOne({ uid: auth.uid, cardNumber: cardNumber });
                if (card) {
                    const response: any = {
                        error: true,
                        status: HttpStatusCode.BAD_REQUEST,
                        path: req.path,
                        method: req.method,
                        msg: `card number ${cardNumber} existed in your wallet`,
                        data: {
                            cardNumber: cardNumber,
                        }
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.BAD_REQUEST).send();
                } else {
                    const nCard = new Card({
                        cardNumber: cardNumber,
                        cvv: cvv,
                        ownerName: ownerName,
                        uid: auth.uid,
                    })
                    const error = await nCard.validateSync();
                    if (error) {
                        const response: any = {
                            error: true,
                            data: {
                                error: error,
                                cardNumber: cardNumber,
                                cvv: cvv,
                                ownerName: ownerName
                            },
                            path: req.path,
                            method: req.method,
                            status: HttpStatusCode.BAD_REQUEST,
                            msg: `body property format wrong`
                        };
                        Log.default(response);
                        await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                    } else {
                        const rCard = await nCard.save();
                        const responseCard: { _id: string } & ICard = {
                            cardNumber: `${rCard.cardNumber.substring(0, 3)} *** ****`,
                            ownerName: rCard.ownerName,
                            _id: rCard._id.toString(),
                        }
                        const response: any = {
                            error: false,
                            data: responseCard,
                            status: HttpStatusCode.OK,
                            path: req.path,
                            method: req.method,
                            msg: `success! add new cart to your wallet`
                        };
                        Log.default(response);
                        await res.status(HttpStatusCode.OK).send(response);
                    }
                }
            }
        });
    }

    public async update(req: IRequest, res: IResponse) {
        const {
            cardNumber,
            cvv,
            ownerName,
        } = await req.body;
        await Token.verify(req, res, async (req, res, auth) => {
            if (!cardNumber) {
                const response: any = {
                    error: true,
                    data: {
                        cardNumber: cardNumber,
                    },
                    status: HttpStatusCode.BAD_REQUEST,
                    path: req.path,
                    method: req.method,
                    msg: `body property card number is empty`
                };
                Log.default(response);
                await res.status(HttpStatusCode.BAD_REQUEST).send(response);
            } else {
                const oCard = await Card.findOne({ uid: auth.uid, cardNumber: cardNumber });
                if (!oCard) {
                    const response: any = {
                        error: true,
                        status: HttpStatusCode.NOT_FOUND,
                        path: req.path,
                        method: req.method,
                        data: {
                            cardNumber: cardNumber
                        },
                        msg: `not found information card with card number: ${cardNumber}`
                    }
                    Log.default(response);
                    await res.status(HttpStatusCode.OK).send(response);
                } else {
                    oCard.cardNumber = cardNumber ?? oCard.cardNumber;
                    oCard.cvv = cvv ?? oCard.cvv;
                    oCard.ownerName = ownerName ?? oCard.ownerName;
                    const error = await oCard.validateSync();
                    if (error) {
                        const response: any = {
                            error: true,
                            data: {
                                error: error,
                                cardNumber: cardNumber,
                                cvv: cvv,
                                ownerName: ownerName
                            },
                            status: HttpStatusCode.BAD_REQUEST,
                            path: req.path,
                            method: req.method,
                            msg: `body property format wrong`
                        };
                        Log.default(response);
                        await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                    } else {
                        const rCard = await oCard.save();
                        const responseCard: { _id: string } & ICard = {
                            cardNumber: `${rCard.cardNumber.substring(0, 3)} *** ****`,
                            ownerName: rCard.ownerName,
                            _id: rCard._id.toJSON(),
                        }
                        const response = {
                            error: false,
                            data: responseCard,
                            status: HttpStatusCode.OK,
                            method: req.method,
                            path: req.path,
                            msg: 'update information card success!'
                        }
                        Log.default(response);
                        await res.status(HttpStatusCode.OK).send(response);
                    }
                }
            }
        });
    }

    public async destroy(req: IRequest, res: IResponse) {
        const { cid } = await req.params;
        if (!ObjectId.isValid(cid)) {
            const response: any = {
                error: true,
                status: HttpStatusCode.BAD_REQUEST,
                path: req.path,
                method: req.method,
                data: {
                    cid: cid
                },
                msg: `param format wrong! cid: ${cid}`
            }
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const card = await Card.findOne({
                    uid: auth.uid,
                    _id: cid,
                });
                if (!card) {
                    const response: any = {
                        error: true,
                        status: HttpStatusCode.NOT_FOUND,
                        path: req.path,
                        method: req.method,
                        data: {
                            cid: cid
                        },
                        msg: `not found information card with cid: ${cid}`
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.NOT_FOUND).send(response);
                } else {
                    const oldCard = await card.delete();
                    const responseCard: { _id: string } & ICard = {
                        cardNumber: `${oldCard.cardNumber.substring(0, 3)} *** ****`,
                        ownerName: oldCard.ownerName,
                        _id: oldCard._id.toString(),
                    }
                    const response: any = {
                        error: false,
                        data: responseCard,
                        path: req.path,
                        method: req.method,
                        status: HttpStatusCode.OK,
                        msg: `success!`
                    }
                    Log.default(response);
                    await res.status(HttpStatusCode.OK).send(response);
                }
            });
        }
    }

    public async show(req: IRequest, res: IResponse) {
        const { cid } = await req.params;
        if (!ObjectId.isValid(cid)) {
            const response: any = {
                error: true,
                data: {
                    cid: cid
                },
                path: req.path,
                method: req.method,
                status: HttpStatusCode.BAD_REQUEST,
                msg: `param cid format wrong! cid: ${cid}`
            }
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const card = await Card.findOne({
                    uid: auth.uid,
                    _id: cid,
                });
                if (!card) {
                    const response = {
                        error: true,
                        status: HttpStatusCode.NOT_FOUND,
                        path: req.path,
                        method: req.method,
                        data: {
                            cid: cid
                        },
                        msg: `not found information card with cid: ${cid}`
                    }
                    Log.default(response);
                    await res.status(HttpStatusCode.NOT_FOUND).send(response);
                } else {
                    const responseCard: { _id: string } & ICard = {
                        cardNumber: `${card.cardNumber.substring(0, 3)} *** ****`,
                        ownerName: card.ownerName,
                        _id: card._id.toString(),
                    }
                    const response = {
                        error: false,
                        data: responseCard,
                        status: HttpStatusCode.OK,
                        path: req.path,
                        method: req.method,
                        msg: `delete card with cid: ${cid} success!`
                    };
                    Log.default(response)
                    await res.status(HttpStatusCode.OK).send(response);
                }
            });
        }
    }
}

export default new CardController;