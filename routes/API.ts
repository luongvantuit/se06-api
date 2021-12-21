import { Router, json } from "express";
import CardController from "../controllers/CardController";
import CheckEmailRecordController from "../controllers/CheckEmailRecordController";
import ShopController from "../controllers/ShopController";
import UserController from "../controllers/UserController";
const API: Router = Router();

API.post('/check/email/record', json(), CheckEmailRecordController.index)

// All api information user
API.get('/user', UserController.index);
API.get('/user/:uid', UserController.show);
API.post('/user', json(), UserController.create);
API.put('/user', json(), UserController.update);

// All api shop
API.get('/shop', ShopController.index);
API.get('/shop/:sid', ShopController.show);
API.post('/shop', json(), ShopController.create);
API.put('/shop/:sid', json(), ShopController.update);
API.delete('/shop/:sid', json(), ShopController.destroy);

// API card
API.get('/card', CardController.index);
API.get('/card/:cid', CardController.show);
API.post('/card', json(), CardController.create);
API.put('/card/:cid', json(), CardController.update);
API.delete('/card/:cid', json(), CardController.destroy);


export default API;
