import { Router, json } from "express";
import CheckEmailRecordController from "../controllers/CheckEmailRecordController";
import UserController from "../controllers/UserController";
const API: Router = Router();

API.post('/check/email/record', json(), CheckEmailRecordController.index)
API.get('/user', UserController.index);
API.get('/user/:uid', UserController.show);
API.post('/user', json(), UserController.create);
API.put('/user', json(), UserController.update);

export default API;
