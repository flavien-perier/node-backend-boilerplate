import * as express from "express";
const add = require("bindings")("addon.node").add as (value1, value2) => number;

const router = express.Router();

router.get("/", (req, res) => {
    const { value1, value2 } = req.query;

    res.json({
        result: add(value1, value2)
    });
});

export default router;
