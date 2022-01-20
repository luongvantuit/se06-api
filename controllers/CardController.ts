import { ObjectId } from "mongodb";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Log from "../middlewares/Log";
import Card, { ICard } from "../models/Card";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class CardController extends IController {

    private TAG: string = "CARDCONTROLLER";

    public async index(req: IRequest, res: IResponse) {
        Log.warn(`${this.TAG}: ${Date.toString()}`);
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
        Log.warn(`${this.TAG}: ${Date.toString()}`);
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
                    if (error !== null) {
                        const response: any = {
                            error: true,
                            data: error,
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
                res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                });
            } else {
                const oCard = await Card.findOne({ uid: auth.uid, cardNumber: cardNumber });
                if (!oCard) {
                    res.status(HttpStatusCode.OK).send({
                        error: true,
                    });
                } else {
                    oCard.cardNumber = cardNumber ?? oCard.cardNumber;
                    oCard.cvv = cvv ?? oCard.cvv;
                    oCard.ownerName = ownerName ?? oCard.ownerName;
                    const error = await oCard.validateSync();
                    if (error !== null) {
                        res.status(HttpStatusCode.BAD_REQUEST).send({
                            error: true,
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
            });
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const card = await Card.findOne({
                    uid: auth.uid,
                    _id: cid,
                });
                if (!card) {
                    await res.status(HttpStatusCode.NOT_FOUND).send({
                        error: true,
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
        Log.warn(`${this.TAG}: ${Date.toString()}`);
        const { cid } = await req.params;
        if (!ObjectId.isValid(cid)) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
    
            });
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const card = await Card.findOne({
                    uid: auth.uid,
                    _id: cid,
                });
                if (!card) {
                    await res.status(HttpStatusCode.NOT_FOUND).send({
                        error: true,
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