import sessionService from "../../service/sessionService";
import * as express from "express";

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

router.get("/ping", (req, res) => {
    res.json({ping: "pong"});
});

export default router;
