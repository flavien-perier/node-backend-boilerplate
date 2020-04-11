import HttpError from "./HttpError";

export default class HttpBadRequestError extends HttpError {
    public get statusCode() {
        return 400;
    }
}
