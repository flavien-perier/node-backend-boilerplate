import sessionService from "../../service/sessionService";
import * as express from "express";
import sumRouter from "./sum";

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

router.use("/sum", sumRouter);

export default router;
