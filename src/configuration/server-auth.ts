import sessionService from "../global/service/session.service";
import * as express from "express";
import sumController from "../sum/controller/sum.controller";

const router = express.Router();

router.use(async (req, res, next) => {
    try {
        const bearerToken = /^Bearer ?(.*)$/i.exec(req.headers.authorization)[1];
        await sessionService.loadSession(bearerToken);
        next();
    } catch (err) {
        next(err);
    }
});

router.use("/sum", sumController);

export default router;
