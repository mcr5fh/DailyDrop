'use strict';

class BadRequestError {
    constructor(message) {
        this.message = (message || "");
        this.name = "BadRequestError";
        this.error = new Error();
    }
};

module.exports = {
    BadRequestError,
    BAD_REQUEST_RESPONSE_CODE: 400
};