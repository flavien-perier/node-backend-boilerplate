import * as express from "express";
import PingDto from "../dto/ping.dto";

const router = express.Router();

router.get("/", (req, res) => {
    res.json(new PingDto("OK"));
});

export default router;
