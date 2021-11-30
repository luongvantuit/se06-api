import { Router } from "express";
import HomeController from "../controllers/Views/HomeController";

const Web: Router = Router();

Web.get("/", HomeController.index);

export default Web;
