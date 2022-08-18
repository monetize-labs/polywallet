"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLeadingZeros = exports.encodeBase64 = exports.deepEquals = exports.asyncFind = void 0;
function asyncFind(arr, predicate) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const e of arr) {
            if (yield predicate(e))
                return e;
        }
        return undefined;
    });
}
exports.asyncFind = asyncFind;
function deepEquals(array1, array2) {
    return (array1.length === array2.length &&
        array1.every((value, index) => value === array2[index]));
}
exports.deepEquals = deepEquals;
function encodeBase64(buffer) {
    if (typeof window === 'undefined') {
        return Buffer.from(buffer).toString('base64');
    }
    else {
        return window.btoa(String.fromCharCode.apply(null, Array.from(buffer)));
    }
}
exports.encodeBase64 = encodeBase64;
function removeLeadingZeros(array) {
    return array.filter(((last) => (v) => (last = last || !!v))(false));
}
exports.removeLeadingZeros = removeLeadingZeros;
