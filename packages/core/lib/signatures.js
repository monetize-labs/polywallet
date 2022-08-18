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
exports.AbstractPaymailSignatures = exports.AbstractSignatures = void 0;
const paymail_client_1 = require("@moneybutton/paymail-client");
const nimble_1 = require("@runonbitcoin/nimble");
const decode_hex_1 = __importDefault(require("@runonbitcoin/nimble/functions/decode-hex"));
const ecdsa_verify_1 = __importDefault(require("@runonbitcoin/nimble/functions/ecdsa-verify"));
const encode_hex_1 = __importDefault(require("@runonbitcoin/nimble/functions/encode-hex"));
const sha256d_1 = __importDefault(require("@runonbitcoin/nimble/functions/sha256d"));
const write_varint_1 = __importDefault(require("@runonbitcoin/nimble/functions/write-varint"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class AbstractSignatures {
    verify(data, signature, publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = {
                r: (0, utils_1.removeLeadingZeros)(signature.slice(1, 33)),
                s: (0, utils_1.removeLeadingZeros)(signature.slice(33, 65)),
            };
            const writer = new nimble_1.classes.BufferWriter();
            (0, write_varint_1.default)(writer, constants_1.BSM_DATA_PREFIX.length);
            writer.write(constants_1.BSM_DATA_PREFIX);
            (0, write_varint_1.default)(writer, data.length);
            writer.write(data);
            const hash = (0, sha256d_1.default)(writer.toBuffer());
            const publicKeyHex = (0, encode_hex_1.default)(publicKey !== null && publicKey !== void 0 ? publicKey : (yield this.getPublicKey()));
            const { point } = nimble_1.PublicKey.fromString(publicKeyHex);
            return (0, ecdsa_verify_1.default)(rs, hash, point);
        });
    }
}
exports.AbstractSignatures = AbstractSignatures;
class AbstractPaymailSignatures extends AbstractSignatures {
    constructor() {
        super(...arguments);
        this.paymailClient = new paymail_client_1.PaymailClient();
    }
    getPublicKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.publicKey) {
                const paymail = yield this.getPaymail();
                const publicKeyHex = yield this.paymailClient.getPublicKey(paymail);
                this.publicKey = (0, decode_hex_1.default)(publicKeyHex);
            }
            return this.publicKey;
        });
    }
    getChangeOutputScript() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.changeOutputScript) {
                const paymail = yield this.getPaymail();
                const timestamp = JSON.stringify({ now: new Date() });
                const amount = '0';
                const purpose = 'Getting my own damn Bitcoin address.';
                const { publicKey, signature } = yield this.sign(new TextEncoder().encode(paymail + timestamp + amount + purpose));
                const scriptHex = yield this.paymailClient.getOutputFor(paymail, {
                    senderHandle: paymail,
                    purpose,
                    dt: timestamp,
                    pubkey: (0, encode_hex_1.default)(publicKey),
                    signature: (0, utils_1.encodeBase64)(signature),
                });
                this.changeOutputScript = (0, decode_hex_1.default)(scriptHex);
            }
            return this.changeOutputScript;
        });
    }
}
exports.AbstractPaymailSignatures = AbstractPaymailSignatures;
