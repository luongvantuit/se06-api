import { Router } from "express";
import WelcomeController from "../controllers/Views/WelcomeController";

const Web: Router = Router();

Web.get("/", WelcomeController.index);

export default Web;
