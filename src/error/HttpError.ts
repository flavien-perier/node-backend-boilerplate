import { Response } from "express";

export default abstract class HttpError extends Error {
    constructor(message: string) {
        super(message)
    }

    public abstract get statusCode(): number;

    public apply(res: Response) {
        res.statusMessage = this.message;
        res.status(this.statusCode).end();
    }
}
