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
exports.TwetchWallet = void 0;
const core_1 = require("@polywallet/core");
const decode_base64_1 = __importDefault(require("@runonbitcoin/nimble/functions/decode-base64"));
const decode_hex_1 = __importDefault(require("@runonbitcoin/nimble/functions/decode-hex"));
class TwetchWallet extends core_1.AbstractPaymailSignatures {
    constructor() {
        super(...arguments);
        this.authenticateButtonOptions = {
            color: {
                base: ['#323340', '#2e2f3e'],
                hover: ['#2c2d38', '#2b2c3a'],
            },
            label: 'Twetch',
            logo: 'data:image/webp;base64,UklGRq4FAABXRUJQVlA4WAoAAAAwAAAAFwAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOExvAwAALxfABRCvBre29rbNH5kzJ5A6lRpFQwbbvUdx7TZnmwH4CawBt7Zt1co5+8pzb4BB5NIKRXpMKRRA6vrsOtzatlUr+8jVLyE5pFRDkd4TxK7P37kCuW0jQXKScvXu3u8CCIDQ3ePT9odXu3966XB67XjlAiLnm9tO1zf3+DJsd3DxP07Zy9v/dX1UVHkPz8+Lqd3u6BLNeybkvb5/jASvbc+vKLKn19eAnDLzW7ahpj3Dyk9JmV/Li+T7d3p1Hf0tdSLBO/uo1Nr+uNXUidSiL38gmPnygOqABEP8ztPKKkFgDB0yzjsbsr5UOxbKqVJfn7+RYkWZB4Sc34+iZLHFAocsJ5oJtOBLgRszLQbLyuDnf74s923BUp0g0QgwrXN1ffQ7j4nUGJwofc5aqn3O2BFAVdjmbKolZy2WigiR5Lyrx4DJWFUZ511PJIUMkLAQ+4cEz7my4C1kFiNCgZy1Eq2yLPLWFgghI2Qw3xMhiImlPkg1YAQJmbUAoqpSbt8XAJlysRSL2TPfCrFn3l7dZBbaRDAA+/sbU6i8jsyVgMm0LdVl9vU3pMor6gwJEfUQBElM81RaRqu18lx9fg0Bt1RGeRn8zcuQgQVDhi20WAgGEeXM+1qIpTxPtlgT4axmKy8iIhYB07IuprJERyrEYvayIoiptexbkVCWhRgMmUPA37xUN4n5HlDvf53q+7Ovn7GuO/n++x+R8GE/YgWAqsp+/8eLqR+BxISQCRANEmTbNm1nftu2bdu2bdu2bQU/tm07P3aa9BA0IKL/atu2YeT01bkCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ776xXCUxUq7xSFJb3SVtUZNmZsflUJdeq9HjZfZSwtLsYe1K1v2jW18Lnge/ThPGQr/WMXfflz+q9d7rprwzEkz1zexTd9em4zvLNz7MNZUWCWJ80Lz1150QpwGL4d8XnBPrBZHfd71qMePQydVneS+Cbp0PEHI+sWSy65b88fug5Z5O5WdbwdRYjnv0+NpEeEv+1S8XGwpLBDE4YDf07UasZ7fD5M9zPqk1gkiffpqzHrV978qbhFceNx/4CTlHTpnuekU/+dRsvWdYPC4pBFn//WcOd4W1p2+8na1QFW6Mos18jGuP40iEioRII/Vnzu7cDhTLeEllNYX/8J0AAA==',
        };
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            this.extensionGuard('authenticate()');
            const { paymail, publicKey } = yield this.twetch.connect();
            this.paymail = paymail;
            this.publicKey = (0, decode_hex_1.default)(publicKey);
        });
    }
    isAuthenticated() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = this.twetch) === null || _a === void 0 ? void 0 : _a.isConnected) !== null && _b !== void 0 ? _b : false;
        });
    }
    sendToBitcoinAddress(destinationAddress, amountSatoshis) {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('sendToBitcoinAddress()');
            const { rawtx } = yield this.twetch.abi({
                contract: 'payment',
                outputs: [{ to: destinationAddress, sats: amountSatoshis }],
            });
            return core_1.UtxoP2PKH.fromTransactionHex(rawtx, destinationAddress);
        });
    }
    getPaymail() {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('getPaymail()');
            if (!this.paymail) {
                this.paymail = this.twetch.paymail;
            }
            return this.paymail;
        });
    }
    sign(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('sign()');
            const dataBase64 = (0, core_1.encodeBase64)(data);
            const { sig } = yield this.twetch.abi({
                contract: 'sign-message',
                method: 'sign-message',
                payload: { message: dataBase64 },
            });
            return {
                data: new TextEncoder().encode(dataBase64),
                publicKey: yield this.getPublicKey(),
                signature: (0, decode_base64_1.default)(sig, 'base64'),
            };
        });
    }
    authenticationGuard(method) {
        var _a;
        this.extensionGuard(method);
        if (!((_a = this.twetch) === null || _a === void 0 ? void 0 : _a.isConnected)) {
            throw new core_1.AuthenticationError(`Attempted to call ${method} on Twetch wallet while unauthenticated. Please call authenticate() first.`);
        }
    }
    extensionGuard(method) {
        if (!this.twetch) {
            const provider = window.bitcoin;
            if (provider === null || provider === void 0 ? void 0 : provider.isTwetch) {
                this.twetch = provider;
            }
            else {
                window.open('https://twetch.com/downloads', '_blank');
                throw new core_1.AuthenticationError(`Attempted to call ${method} on Twetch wallet while extension is not installed. Please install Twetch Wallet Extension first.`);
            }
        }
    }
}
exports.TwetchWallet = TwetchWallet;
