import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Firebase from "../services/auths/Firebase";
import CodeError from "./CodeError";
import HttpStatusCode from "./HttpStatusCode";

class Token {
    public async verify(req: IRequest, res: IResponse, ok: (res: IRequest, req: IResponse, auth: DecodedIdToken) => void): Promise<void> {
        const { token } = await req.headers;
        if (token === undefined)
            return res.status(HttpStatusCode.UNAUTHORIZED)
                .send({
                    code: CodeError.TOKEN_HEADER_EMPTY,
                    error: true,
                })
                .end();
        try {
            const auth: DecodedIdToken = await Firebase.auth().verifyIdToken(token.toString(), true);
            return ok(req, res, auth);
        }
        catch (error: any) {
            return res.status(HttpStatusCode.UNAUTHORIZED)
                .send({
                    code: CodeError.TOKEN_VERIFY_FAILED,
                    error: true,
                })
                .end();
        }
    }
}

export default new Token;