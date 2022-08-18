"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtxoP2PKH = void 0;
const nimble_1 = require("@runonbitcoin/nimble");
const decode_hex_1 = __importDefault(require("@runonbitcoin/nimble/functions/decode-hex"));
class UtxoP2PKH {
    constructor(address, amountSatoshis, previousTransactionId, previousTransactionOutpoint) {
        this.amountSatoshis = amountSatoshis;
        this.previousTransactionId = previousTransactionId;
        this.previousTransactionOutpoint = previousTransactionOutpoint;
        this.previousScriptPublicKey =
            nimble_1.Address.fromString(address).toScript().buffer;
    }
    static fromTransactionHex(transactionHex, address) {
        const { hash, outputs } = nimble_1.Transaction.fromHex(transactionHex);
        const lockingScriptHex = nimble_1.Address.fromString(address)
            .toScript()
            .toHex();
        const outpoint = outputs.findIndex(({ script }) => script.toHex() === lockingScriptHex);
        if (outpoint === -1) {
            throw new Error('Unexpected error, transaction did not contain address!');
        }
        return new UtxoP2PKH(address, outputs[outpoint].satoshis, (0, decode_hex_1.default)(hash), outpoint);
    }
}
exports.UtxoP2PKH = UtxoP2PKH;
