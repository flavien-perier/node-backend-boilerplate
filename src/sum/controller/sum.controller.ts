import * as express from "express";
import SumDto from "../dto/sum.dto";
const add = require("bindings")("addon.node").add as (value1, value2) => number;

const router = express.Router();

router.get("/", (req, res) => {
    const { value1, value2 } = req.query;

    res.json(new SumDto(add(value1, value2)));
});

export default router;
