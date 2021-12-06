import { validate } from "email-validator";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import CodeError from "../../exception/CodeError";
import HttpStatusCode from "../../exception/HttpStatusCode";
import IBaseResponse from "../../interfaces/vendors/IBaseResponse";
import IController from "../../interfaces/vendors/IController";
import IRequest from "../../interfaces/vendors/IRequest";
import IResponse from "../../interfaces/vendors/IResponse";
import Firebase from "../../services/auths/Firebase";

class AuthController extends IController {

    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { email } = await req.body;
        if (!email)
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send(
                    {
                        code: CodeError.BODY_PROPERTY_EMPTY,
                        error: true,
                    }
                )
                .end();

        if (!validate(email))
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send(
                    {
                        code: CodeError.BODY_PROPERTY_WRONG_FORMAT,
                        error: true,
                    }
                )
                .end();
        try {
            await Firebase.auth().getUserByEmail(email);
            return res.status(HttpStatusCode.OK)
                .send(
                    {
                        error: true,
                        code: CodeError.RECORD_EMAIL_EXISTED,
                    }
                )
                .end();
        } catch (error: any) {
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send(
                    {
                        error: false,
                    }
                )
                .end();
        }
    }
}

export default new AuthController;