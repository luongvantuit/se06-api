import { Router } from "express";
import HttpStatusCode from "../perform/HttpStatusCode";

const Web: Router = Router();

Web.get("/", (res, req) => {
    return req.status(HttpStatusCode.OK).render('index.ejs');
});

Web.get("*", (res, req) => {
    return req.status(HttpStatusCode.NOT_FOUND).render('404.ejs');
})

export default Web;
