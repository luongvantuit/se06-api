import { validate } from "email-validator";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IBaseResponse from "../interfaces/vendors/IBaseResponse";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import CodeError from "../perform/CodeError";
import HttpStatusCode from "../perform/HttpStatusCode";
import Firebase from "../services/auths/Firebase";

class CheckEmailRecordController extends IController {
    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { email } = req.body;
        if (!validate(email))
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    code: CodeError.BODY_PROPERTY_WRONG_FORMAT,
                    error: true,
                })
                .end();
        try {
            const user = await Firebase.auth().getUserByEmail(email);
            return res.status(HttpStatusCode.OK)
                .send({
                    code: CodeError.RECORD_EMAIL_EXISTED,
                    error: false,
                    data: user,
                })
                .end();
        } catch (error: any) {
            return res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                })
                .end();
        }
    }
}


export default new CheckEmailRecordController;
