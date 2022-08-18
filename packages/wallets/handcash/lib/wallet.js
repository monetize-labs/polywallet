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
exports.HandCashWallet = void 0;
const handcash_connect_1 = require("@handcash/handcash-connect");
const core_1 = require("@polywallet/core");
const nimble_1 = require("@runonbitcoin/nimble");
const decode_base64_1 = __importDefault(require("@runonbitcoin/nimble/functions/decode-base64"));
const decode_hex_1 = __importDefault(require("@runonbitcoin/nimble/functions/decode-hex"));
const eciesjs_1 = require("eciesjs");
class HandCashWallet extends core_1.AbstractPaymailSignatures {
    constructor(options) {
        super();
        this.authenticateButtonOptions = {
            color: {
                base: ['#38cb7c', '#1cb462'],
                hover: ['#31c475', '#16b15d'],
            },
            label: 'HandCash',
            logo: 'data:image/webp;base64,UklGRmQEAABXRUJQVlA4WAoAAAAwAAAAFwAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOEwmAgAALxfABRBnxaBtG0Euf9C5u38QBJI2rn/nX0BQ5P9oCNq2bapu9xNI2hTY9sdA2iQAEOZQ4CONAA8ojs4vAgeOBGMURwIYYGEuQb8slD/FXckcFMUojgzCWJjPmwQFHg1zBPOeHAZuoEvnyDEKREdwAChE59IDiI0DV8Eo4E7iJgkz7yQoDgtjKB8VUMABBvjuCUAdKRpGvpFhLpVHDTsl94jvjd8HjsQpGQGnZA4FEiTJNm2rnm3btm37fdu2bfvfbz37oGd5LuLPIKL/atu2Yexk6u0KAAAAAAAAAACgcby7KCXIh29GXxoMScuP9lR41ZY3r2shdkvSums62FP7P2lrALj27MOGpb+7Qt213WWbi5NAZG7T3vfSvx1+jqa/kLQrwr23wIZFU9/rgYDZJc1t9zZj6SvLOB0FSXdlXA0AKrcd7AyF5FOG3hRC/g/97AF65yWd3f9UkjQAHdLzYihfdMtnyjZl6zBM2HoYBzudNiw3k2XrCkzJvB8DR+RmW/3y8sJtmdehT3qaDV2mG67VBHJCOgolq3I1Q8glx/q1AJLuSKOQ+lhb+4DQHfcenckBWl36VgZBB9asj3XOJqMTApwqNw3jRjxQ/llaqXJbs6O3pLl+txZmfkuvxvICnR4yb0ibZ8PdELT7jzT35OKhGKh+p63ziR49h+34ZTjrHYGsBwvnk73czr/t3FtJJyFscjDM87HcMhYNH7t83B+C//cpAQ==',
        };
        this.connect = new handcash_connect_1.HandCashConnect({
            appId: options.appId,
            appSecret: options.appSecret,
        });
        const authToken = new URLSearchParams(window.location.search).get('authToken');
        if (authToken) {
            this.account = this.connect.getAccountFromAuthToken(authToken);
        }
    }
    authenticate(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (options === null || options === void 0 ? void 0 : options.authToken) {
                this.account = this.connect.getAccountFromAuthToken(options.authToken);
                return;
            }
            if (typeof window === 'undefined') {
                throw new core_1.AuthenticationError('For non-browsers you must provide a handcash authToken in authenticate(opts).');
            }
            location.href = yield this.connect.getRedirectionUrl({
                referrer: (_a = options === null || options === void 0 ? void 0 : options.referrer) !== null && _a !== void 0 ? _a : 'monetize',
            });
        });
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.account) {
                    yield this.account.profile.getCurrentProfile();
                    return true;
                }
                return false;
            }
            catch (_a) {
                return false;
            }
        });
    }
    getSpendableBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('getSpendableBalance()');
            const { spendableSatoshiBalance } = yield this.account.wallet.getSpendableBalance('USD');
            return spendableSatoshiBalance;
        });
    }
    sendToBitcoinAddress(destinationAddress, amountSatoshis) {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('sendToBitcoinAddress(destinationAddress)');
            const { rawTransactionHex } = yield this.account.wallet.pay({
                payments: [
                    {
                        destination: destinationAddress,
                        currencyCode: 'SAT',
                        sendAmount: amountSatoshis,
                    },
                ],
            });
            return core_1.UtxoP2PKH.fromTransactionHex(rawTransactionHex, destinationAddress);
        });
    }
    getPaymail() {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('getPaymail()');
            if (!this.paymail) {
                const { publicProfile: { paymail }, } = yield this.account.profile.getCurrentProfile();
                this.paymail = paymail;
            }
            return this.paymail;
        });
    }
    sign(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('sign(data)');
            const dataBase64 = (0, core_1.encodeBase64)(data);
            const { signature, publicKey } = yield this.account.profile.signData({
                value: dataBase64,
                format: 'utf-8',
            });
            return {
                data: new TextEncoder().encode(dataBase64),
                signature: (0, decode_base64_1.default)(signature),
                publicKey: (0, decode_hex_1.default)(publicKey),
            };
        });
    }
    encrypt(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('encrypt(data)');
            if (!this.encryptionPublicKeyHex) {
                yield this.fetchEncryptionKeyPair();
            }
            const dataBase64 = (0, core_1.encodeBase64)(data);
            return (0, eciesjs_1.encrypt)(Buffer.from((0, decode_hex_1.default)(this.encryptionPublicKeyHex)), Buffer.from(dataBase64));
        });
    }
    decrypt(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('decrypt(data)');
            if (!this.encryptionPrivateKeyHex) {
                yield this.fetchEncryptionKeyPair();
            }
            const dataBase64 = (0, eciesjs_1.decrypt)(Buffer.from(nimble_1.PrivateKey.fromString(this.encryptionPrivateKeyHex).number), Buffer.from(data)).toString();
            return (0, decode_base64_1.default)(dataBase64);
        });
    }
    fetchEncryptionKeyPair() {
        return __awaiter(this, void 0, void 0, function* () {
            const { privateKey, publicKey } = yield this.account.profile.getEncryptionKeypair();
            this.encryptionPrivateKeyHex = privateKey;
            this.encryptionPublicKeyHex = publicKey;
        });
    }
    authenticationGuard(method) {
        if (!this.account) {
            throw new core_1.AuthenticationError(`Attempted to call ${method} on HandCash wallet while unauthenticated. Please call authenticate() first.`);
        }
    }
}
exports.HandCashWallet = HandCashWallet;
