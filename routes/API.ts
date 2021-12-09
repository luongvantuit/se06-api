import { Router, json } from "express";
import CheckEmailRecordController from "../controllers/CheckEmailRecordController";
const API: Router = Router();

API.post('/check/email/record', CheckEmailRecordController.index)


export default API;
