import { Router, json } from "express";
import CardController from "../controllers/CardController";
import CartController from "../controllers/CartController";
import ProductController from "../controllers/ProductController";
import ShopController from "../controllers/ShopController";
import UploadFileController from "../controllers/UploadFileController";
import UploadMultiFilesController from "../controllers/UploadMultiFilesController";
import UserController from "../controllers/UserController";
const API: Router = Router();
// All api information user
API.get('/user', UserController.index);
API.get('/user/:uid', UserController.show);
API.post('/user', json(), UserController.create);
API.put('/user', json(), UserController.update);

// All api shop
API.get('/shops/:uid', ShopController.index);
API.get('/shop/:sid', ShopController.show);
API.post('/shop', json(), ShopController.create);
API.put('/shop/:sid', json(), ShopController.update);
API.delete('/shop/:sid', json(), ShopController.destroy);

// API card
API.get('/cards', CardController.index);
API.get('/card/:cid', CardController.show);
API.post('/card', json(), CardController.create);
API.put('/card', json(), CardController.update);
API.delete('/card/:cid', json(), CardController.destroy);

// API product
API.get('/products', ProductController.index);
API.get('/products/:sid', ProductController.index);
API.get('/product/:pid', ProductController.show);
API.post('/product/:sid', json(), ProductController.create);
API.put('/product/:sid/:pid', json(), ProductController.update);
API.delete('/product/:sid/:pid', json(), ProductController.destroy);


// API cart manager
API.delete('/cart/:cid', CartController.destroy);
API.get('/cart', CartController.index);
API.get('/cart/:cid', CartController.show);
API.post('/cart/:pid', json(), CartController.create);
API.put('/cart/:cid', json(), CartController.update);

// API upload file
API.post('/upload', UploadFileController.create);
API.post('/uploads', UploadMultiFilesController.create);

export default API;
