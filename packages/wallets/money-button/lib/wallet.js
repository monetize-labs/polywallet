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
exports.MoneyButtonWallet = void 0;
const core_1 = require("@polywallet/core");
const javascript_money_button_1 = require("@moneybutton/javascript-money-button");
const decode_base64_1 = __importDefault(require("@runonbitcoin/nimble/functions/decode-base64"));
const decode_hex_1 = __importDefault(require("@runonbitcoin/nimble/functions/decode-hex"));
const encode_hex_1 = __importDefault(require("@runonbitcoin/nimble/functions/encode-hex"));
const async_wait_until_1 = require("async-wait-until");
class MoneyButtonWallet extends core_1.AbstractPaymailSignatures {
    constructor(options) {
        var _a, _b;
        super();
        this.authenticateButtonOptions = {
            color: {
                base: ['#4772f5', '#416ef7'],
                hover: ['#426ff5', '#3767f8'],
            },
            label: 'Money Button',
            logo: 'data:image/webp;base64,UklGRpoEAABXRUJQVlA4WAoAAAAwAAAAFwAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOExcAgAALxfABRBXBLW2bdXVPGFGyazZsk8XqSJlf3SnDbi1batW5v7uAkTukJKRaQFUQRe0rdl2Gtu2q6z7/yfn4HLGonAoPFXQBWVndxm3beQ4J2ku3y8FgAGJBCFJJJBERUBGRCpQBSZBLAEwQ3UESxI2iDBYoFDdUKCEWAIyJmqwJOKAhORKDLlgwY4ghIiIFCNQQUQsZARIUiWh5KgwEBKQCtQtVA9+hJDY1WAEKkRQmzX8//+vEArUImwve3x9vxaBSqCCAuX24UR/N+T1cefz9TSgNK6YnC0pjypiUFCftTg/Xdg9nrk8Xxkdz+jvRxKEJIP6rMXwaMr780F5XGN5veX5fqO+aFEaVZTGNYopkIQAsmXbNm2nX9u2z7VtW7EuYycnxlh7x9p/nTvXyVM+IKL/itw2UnIYWBx6BQAAAAAAAAAAAAAAAAAAAAAAAJCe5H+QmvBBWqrdqxjfm29Ih6L+zfWuXMhqWd0aKqPqmlNwqze5YF/Si8WslMn7ki4UnQskuSslffcChTpurjwJJWn2uhRKD2rXQgssPtYa9wK4fGq4R3XbFl6gmZiTiYObHo/rtuUFPN1uYUgHp4EFZsInJi/gw1PvWROBjz3zT7EjC9ud4SVyYOLsiL/s8/rZp7/YtcCc0BMzsZfPf/758PnwVHYk8SE3HXv1MYp+fz24KqdAd2uWZQk+GW568yOKovcXdg13qbj7tnGjseLo26/o+9OR8otOOu4gZyMuPZxISRm88+7L2/N5lA6sjFYnQX7nwlxbNmTUTy31FFrnMxPmICUl4YP0/2nYAA==',
        };
        this.loadScript();
        this.clientIdentifier = options.clientIdentifier;
        this.minimumAmount = (_a = options.minimumAmount) !== null && _a !== void 0 ? _a : 0.01;
        this.suggestedAmount = (_b = options.suggestedAmount) !== null && _b !== void 0 ? _b : 5;
    }
    loadScript() {
        return __awaiter(this, void 0, void 0, function* () {
            const { IMB } = yield (0, javascript_money_button_1.loadMoneyButtonJs)();
            this.invisibleMoneyButton = new IMB({
                clientIdentifier: this.clientIdentifier,
                minimumAmount: {
                    amount: this.minimumAmount.toString(),
                    currency: 'USD',
                },
                suggestedAmount: {
                    amount: this.suggestedAmount.toString(),
                    currency: 'USD',
                },
            });
        });
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.waitForScript();
            yield this.invisibleMoneyButton.askForPermission();
        });
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.waitForScript();
            try {
                yield this.invisibleMoneyButton.amountLeft();
                return true;
            }
            catch (_a) {
                return false;
            }
        });
    }
    getSpendableBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.waitForScript();
            const { satoshis } = yield this.invisibleMoneyButton.amountLeft();
            return parseInt(satoshis, 10);
        });
    }
    sendToBitcoinAddress(destinationAddress, amountSatoshis) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.waitForScript();
            const amountBsv = amountSatoshis / core_1.SATOSHIS_PER_BITCOIN;
            const { payment: { rawtx }, } = yield this.invisibleMoneyButton.swipe({
                outputs: [
                    {
                        to: destinationAddress,
                        amount: amountBsv.toString(10),
                        currency: 'BSV',
                    },
                ],
            });
            return core_1.UtxoP2PKH.fromTransactionHex(rawtx, destinationAddress);
        });
    }
    getPaymail() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.waitForScript();
            if (!this.paymail) {
                const { cryptoOperations: [{ value }], } = yield this.invisibleMoneyButton.swipe({
                    cryptoOperations: [{ name: 'myPaymail', method: 'paymail' }],
                });
                this.paymail = value;
            }
            return this.paymail;
        });
    }
    sign(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.waitForScript();
            const dataBase64 = (0, core_1.encodeBase64)(data);
            const { cryptoOperations: [{ value: publicKeyHex }, { value: signatureBase64 }], } = yield this.invisibleMoneyButton.swipe({
                cryptoOperations: [
                    {
                        name: 'publicKey',
                        method: 'public-key',
                        key: 'identity',
                    },
                    {
                        name: 'signature',
                        method: 'sign',
                        data: dataBase64,
                        dataEncoding: 'utf8',
                        key: 'identity',
                        algorithm: 'bitcoin-signed-message',
                    },
                ],
            });
            return {
                data: new TextEncoder().encode(dataBase64),
                publicKey: (0, decode_hex_1.default)(publicKeyHex),
                signature: (0, decode_base64_1.default)(signatureBase64),
            };
        });
    }
    encrypt(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.waitForScript();
            const { cryptoOperations: [{ value }], } = yield this.invisibleMoneyButton.swipe({
                cryptoOperations: [
                    {
                        name: 'encryption',
                        method: 'encrypt',
                        data: (0, encode_hex_1.default)(data),
                        dataEncoding: 'utf8',
                        key: 'identity',
                        algorithm: 'electrum-ecies',
                    },
                ],
            });
            return (0, decode_hex_1.default)(value);
        });
    }
    decrypt(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.waitForScript();
            const { cryptoOperations: [{ value }], } = yield this.invisibleMoneyButton.swipe({
                cryptoOperations: [
                    {
                        name: 'decryption',
                        method: 'decrypt',
                        data: (0, encode_hex_1.default)(data),
                        dataEncoding: 'hex',
                        valueEncoding: 'utf8',
                        key: 'identity',
                        algorithm: 'electrum-ecies',
                    },
                ],
            });
            return (0, decode_hex_1.default)(value);
        });
    }
    waitForScript() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, async_wait_until_1.waitUntil)(() => !!this.invisibleMoneyButton);
        });
    }
}
exports.MoneyButtonWallet = MoneyButtonWallet;
