export default class BadRequestInformationsBean {
    constructor(
        public message: string,
        public errors: any[]
    ) {}
}
