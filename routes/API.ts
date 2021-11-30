import { Router } from "express";
import RateController from "../controllers/Product/RateController";

const API: Router = Router();

API.get('/rate/:id', RateController.index)


export default API;
