import { Router, json } from "express";
import CardController from "../controllers/CardController";
import CheckEmailRecordController from "../controllers/CheckEmailRecordController";
import ProductController from "../controllers/ProductController";
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
API.get('/shops', ShopController.index);
API.get('/shop/:sid', ShopController.show);
API.post('/shop', json(), ShopController.create);
API.put('/shop/:sid', json(), ShopController.update);
API.delete('/shop/:sid', json(), ShopController.destroy);

// API card
API.get('/cards', CardController.index);
API.get('/card/:cid', CardController.show);
API.post('/card', json(), CardController.create);
API.put('/card/:cid', json(), CardController.update);
API.delete('/card/:cid', json(), CardController.destroy);

// API product
API.get('/products/:sid', ProductController.index);
API.get('/product/:pid', ProductController.show);
API.post('/product/:sid', json(), ProductController.create);
API.put('/product/:sid/:pid', json(), ProductController.update);
API.delete('/product/:sid/:pid', json(), ProductController.destroy);



export default API;
