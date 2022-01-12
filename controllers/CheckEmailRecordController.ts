import { validate } from "email-validator";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import CodeResponse from "../perform/CodeResponse";
import HttpStatusCode from "../perform/HttpStatusCode";
import Firebase from "../services/auths/Firebase";

class CheckEmailRecordController extends IController {
    public async index(req: IRequest, res: IResponse) {
        const { email } = req.body;
        if (!validate(email))
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    code: CodeResponse.BODY_PROPERTY_WRONG_FORMAT,
                    error: true,
                })
                .end();
        try {
            const user = await Firebase.auth().getUserByEmail(email);
            return res.status(HttpStatusCode.OK)
                .send({
                    code: CodeResponse.RECORD_EMAIL_EXISTED,
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
