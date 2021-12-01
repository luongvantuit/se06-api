import { Router, json } from "express";
import RateController from "../controllers/Product/RateController";
import CartController from "../controllers/User/CartController";

const API: Router = Router();


// rate
API.get('/rates', RateController.index);
API.get('/rates/:productID', RateController.show);
API.post('/rates/:productID', json(), RateController.store);


// cart
API.get('/cart', CartController.index);
API.post('/cart', CartController.store);


export default API;
