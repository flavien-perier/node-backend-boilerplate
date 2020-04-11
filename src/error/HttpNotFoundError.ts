import HttpError from "./HttpError";

export default class HttpNotFoundError extends HttpError {
    public get statusCode() {
        return 404;
    }
}
