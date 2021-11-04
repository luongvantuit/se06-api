import { Router } from "express";
import Account from "../controllers/AccountController";

const API = Router();

API.post('/account/check-email-existed', Account.index)




export default API;