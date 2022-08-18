"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = exports.LogicError = void 0;
class LogicError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, LogicError.prototype);
    }
}
exports.LogicError = LogicError;
class AuthenticationError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, LogicError.prototype);
    }
}
exports.AuthenticationError = AuthenticationError;
