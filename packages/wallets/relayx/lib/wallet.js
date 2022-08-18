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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelayXWallet = void 0;
const core_1 = require("@polywallet/core");
const async_wait_until_1 = __importDefault(require("async-wait-until"));
const load_scripts_1 = __importDefault(require("load-scripts"));
class RelayXWallet extends core_1.AbstractPaymailSignatures {
    constructor(options) {
        super();
        this.authenticateButtonOptions = {
            color: {
                base: ['#2d39c3', '#2832c0'],
                hover: ['#1f2cc6', '#212bbe'],
            },
            label: 'RelayX',
            logo: 'data:image/webp;base64,UklGRk4EAABXRUJQVlA4WAoAAAAwAAAAFwAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOEwQAgAALxfABRB35KCNJEdyfeJP99I3DbdtI0kSNTjz8k/0s+6mILaN5Eiizv/nH6v/n4LYNpIjOUpNz3l/9x+wLZOGmBbBnMU4BYyXFhniCUK+mo/yThZGQ46+J3w9V4bm7KcfeLj6vZNvtwuLlv1twQ16+r+GEfKT8MDskOsjQ4Tp6UxAIRYX///Zr/g7D0fuep2rh7pnWITs9Apjwuw/kLYcuODEfuR/m0xsLjiJ/2xhetVBmMLClXCwRcyEJYJbGLl7irCGjiSz0hoN2U6FaSVsKxDCEmQ7kWSRIYAoSZJpq66fbdvW9bNt27Zt7/7zizh779MHRPRfkdu2jREfi3q9AgAAAAAAAAAAAAAAAAAAAAAAAAAAXXS21Z4bZ/ZKf+fi24d82mgO8cLEkQcxW1vYvno7l+yRYZOvUsj9hdKIhsv5UA9MmnrZ7nTXdO8d9yY03jVZFPoNP29nWECf0nc1ELG+Eat85LiRnVpt4YMnxW2PeVpELwjhUiSn7awUfNq1GrLfp0W1AmPXUZ20ajXYZO1ht1G5ajlzn6WVYP8sWN5NVeAWYiJYKyHnsbXsdDBco8HUIS8qFGkxm2sRPdeDKQawpG89DvkqsDTd1cf3ne1117g7t19GozzEHDR/0RBRsnAghHwcC/BYS/L83VJLUe20OO+P9FJjYPPG46e8Hy/3UWtXH8TmV1ZlfnX+/2YG',
        };
        this.bitcomPrefix = options.bitcomPrefix;
        (0, load_scripts_1.default)('https://one.relayx.io/relayone.js');
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.relayone) {
                yield (0, load_scripts_1.default)('https://one.relayx.io/relayone.js');
                yield (0, async_wait_until_1.default)(() => !!window.relayone);
                this.relayone = window.relayone;
            }
            yield this.relayone.authBeta();
        });
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.relayone) {
                yield (0, load_scripts_1.default)('https://one.relayx.io/relayone.js');
                yield (0, async_wait_until_1.default)(() => !!window.relayone);
                this.relayone = window.relayone;
            }
            return this.relayone.isLinked();
        });
    }
    getSpendableBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const { satoshis } = yield this.relayone.getBalance2();
            return parseInt(satoshis);
        });
    }
    sendToBitcoinAddress(destinationAddress, amountSatoshis) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rawTx } = yield this.relayone.send({
                to: destinationAddress,
                amount: amountSatoshis / core_1.SATOSHIS_PER_BITCOIN,
                currency: 'BSV',
            });
            return core_1.UtxoP2PKH.fromTransactionHex(rawTx, destinationAddress);
        });
    }
    getPaymail() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.paymail) {
                return this.paymail;
            }
            const token = yield this.relayone.authBeta();
            const [payload] = token.split('.');
            const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
            this.paymail = data.paymail;
            return this.paymail;
        });
    }
    sign(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataBase64 = Buffer.from(data).toString('base64');
            const { value: signatureBase64 } = yield this.relayone.sign(this.bitcomPrefix + dataBase64);
            return {
                data: Buffer.from(dataBase64),
                signature: Buffer.from(signatureBase64, 'base64'),
                publicKey: yield this.getPublicKey(),
            };
        });
    }
    encrypt(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataHex = Buffer.from(data).toString('hex');
            const paymail = yield this.getPaymail();
            const { value } = yield this.relayone.encrypt(this.bitcomPrefix + dataHex, paymail);
            return Buffer.from(value, 'hex');
        });
    }
    decrypt(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataHex = Buffer.from(data).toString('hex');
            const { value } = yield this.relayone.decrypt(dataHex);
            const decryptedDataHex = value.slice(this.bitcomPrefix.length);
            return Buffer.from(decryptedDataHex, 'hex');
        });
    }
}
exports.RelayXWallet = RelayXWallet;
