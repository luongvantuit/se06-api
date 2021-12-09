import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Firebase from "../services/auths/Firebase";
import CodeResponse from "./CodeResponse";
import HttpStatusCode from "./HttpStatusCode";

class Token {
    public async verify(req: IRequest, res: IResponse, successed: (req: IRequest, res: IResponse, auth: DecodedIdToken) => void, failed: (req: IRequest, res: IResponse) => void): Promise<void> {
        const { token } = await req.headers;
        if (token === undefined) {
            if (failed === undefined)
                return res.status(HttpStatusCode.UNAUTHORIZED)
                    .send({
                        code: CodeResponse.TOKEN_HEADER_EMPTY,
                        error: true,
                    })
                    .end();
            else
                return failed(req, res);
        }
        try {
            const auth: DecodedIdToken = await Firebase.auth().verifyIdToken(token.toString(), true);
            return successed(req, res, auth);
        }
        catch (error: any) {
            if (failed === undefined)
                return res.status(HttpStatusCode.UNAUTHORIZED)
                    .send({
                        code: CodeResponse.TOKEN_VERIFY_FAILED,
                        error: true,
                    })
                    .end();
            else
                return failed(req, res);
        }
    }
}

export default new Token;