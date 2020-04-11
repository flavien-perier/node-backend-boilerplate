import HttpError from "./HttpError";

export default class HttpUnauthorizedError extends HttpError {
    public get statusCode() {
        return 401;
    }
}
