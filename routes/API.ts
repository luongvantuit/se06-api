import { Router } from "express";
import RateController from "../controllers/Product/RateController";

const API: Router = Router();

API.get('/rates', RateController.index)
API.get('/rates/:id', RateController.show)

export default API;
