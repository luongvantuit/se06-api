import { Router, json } from "express";
import RateController from "../controllers/Product/RateController";

const API: Router = Router();

API.get('/rates', RateController.index);
API.get('/rates/:productID', RateController.show);
API.post('/rates/:productID', json(), RateController.store);


export default API;
