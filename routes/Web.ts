import { Router } from "express";
import HomeController from "../controllers/Views/HomeController";
import HttpStatusCode from "../exception/HttpStatusCode";

const Web: Router = Router();

Web.get("/", HomeController.index);

Web.get("*", (res, req) => {
    return req.status(HttpStatusCode.NOT_FOUND).render('404.ejs');
})

export default Web;
