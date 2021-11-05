import { Router } from "express";
import AccountController from "../controllers/AccountController";

const API: Router = Router();

API.post("/account/check-email-existed", AccountController.index);

export default API;
