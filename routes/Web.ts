import { Router } from "express";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import * as path from 'path';

const Web: Router = Router();

Web.get('/', (req: IRequest, res: IResponse) => {
    res.sendFile(path.join(__dirname, '../resources/views/welcome.html'));
});


export default Web;