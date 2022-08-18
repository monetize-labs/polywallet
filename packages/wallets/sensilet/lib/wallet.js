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
exports.SensiletWallet = void 0;
const core_1 = require("@polywallet/core");
const nimble_1 = require("@runonbitcoin/nimble");
const decode_base64_1 = __importDefault(require("@runonbitcoin/nimble/functions/decode-base64"));
const decode_hex_1 = __importDefault(require("@runonbitcoin/nimble/functions/decode-hex"));
class SensiletWallet extends core_1.AbstractSignatures {
    constructor() {
        super(...arguments);
        this.authenticateButtonOptions = {
            color: {
                base: ['#517195', '#496d95'],
                hover: ['#466281', '#405e81'],
            },
            label: 'Sensilet',
            logo: 'data:image/webp;base64,UklGRk4FAABXRUJQVlA4WAoAAAAwAAAAFwAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOEwPAwAALxfABRDnBMe2tWPPvb9t2/6TzlatOXAW7lN7DkaVlS59Sts2n2nAjmRbtdJz7nu4O39EQMCkRBAWgft9r6Bu23b8uZ/3ZzOZyb9fMsestnV7q6zq+iNsxsVfHNOabT2M2khyHHX37uXA4vBdAMiaIwExIFN3c0fg2g7B8fNldVuKAHGdWX39fvV363dBxHFoWq4erqrfVo3YrfcgQPD69roYN7QINLtyr2+vE8Hb93u856a8vbxPAt+N/f+Zf6reUKz/q79w4P1fcRDChaAktv+ZgwGKQX7nv0kARDERhhUIwd/8HwQEEoUAg0hADIiseSFQTAIQBfokIJCAQCAEQLbu57szvn2MdzKxykWcj81uZ7wq7FMLDDY/LSiJCQ+npVb1arbQok711tuUF6Sj1KTkthnO2k02S0dpSJefjv3nNd2cKklNyibGBDUpEupkachttE1Fqk5WiyrDjSLQUjDS0FPr02a4EQZqDmZdPXHqsDDtUhKSBaT8M0jY7FAsjxAXJYntjiQdshq21wUlKQJ/FTatFITHcc/B6qpxVg10YhgAIXZWH6dJWkoETAIBARDEANHaNsPN32ZqJqlt27Zt2+7Wtm3sl73Z7UynvYSI/itw20YZHo5fQURERETEbOwZEREREZEMvMIj/H+TdG1OKS/O8GR/s2sSLECi+59kStIAAAn6Ur72SAUE0NLlZA4uA1QLp5IQnX6vTcnl4inflaZ7GkR2SRJPvl70A24yXjcm3Capwvrp8XxUAJUbY97JwMfR2tzDzft70+fZ1uKJijR/ZhtVruFyc3l67GB7oPp+RRnvhqU40sEuuhLq/oyitL/tDB5eKcpQo4rKGEcWUARc9PbMt30D2JvvqG0BCgIZkU828Lo+0jdxfL1b1zB5BzXLj3FDbjk8/dsFRZlq5oXKNDKxcD6FlSqwqmy0LgFVBX6SDviEVgKzw101z6gI85U1xuBTCO20s74fWoGfFe+vZJkLodo/1mTzIBjL403JMlrLBkVirDJfv/3PvAXExQb9DOJ/Js7JWcYEAA==',
        };
        this.isConnected = false;
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            this.extensionGuard('authenticate()');
            yield this.sensilet.requestAccount();
            this.isConnected = yield this.isAuthenticated();
        });
    }
    isAuthenticated() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.isConnected = yield ((_a = this.sensilet) === null || _a === void 0 ? void 0 : _a.isConnect());
            return this.isConnected;
        });
    }
    getChangeOutputScript() {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('getChangeOutputScript()');
            const address = yield this.sensilet.getAddress();
            return nimble_1.Address.fromString(address).toScript().toBuffer();
        });
    }
    sendToBitcoinAddress(destinationAddress, amountSatoshis) {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('sendToBitcoinAddress()');
            const { txHex } = yield this.sensilet.transferBsv({
                receivers: [{ address: destinationAddress, amount: amountSatoshis }],
            });
            return core_1.UtxoP2PKH.fromTransactionHex(txHex, destinationAddress);
        });
    }
    getSpendableBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('getSpendableBalance()');
            const { balance: { total }, } = yield this.sensilet.getBsvBalance();
            return total;
        });
    }
    getPublicKey() {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('getPublicKey()');
            if (!this.publicKey) {
                const publicKeyHex = yield this.sensilet.getPublicKey();
                this.publicKey = (0, decode_hex_1.default)(publicKeyHex);
            }
            return this.publicKey;
        });
    }
    sign(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('sign()');
            const dataBase64 = (0, core_1.encodeBase64)(data);
            const signatureBase64 = yield this.sensilet.signMessage(dataBase64);
            return {
                data: new TextEncoder().encode(dataBase64),
                publicKey: yield this.getPublicKey(),
                signature: (0, decode_base64_1.default)(signatureBase64),
            };
        });
    }
    authenticationGuard(method) {
        if (!this.isConnected) {
            throw new core_1.AuthenticationError(`Attempted to call ${method} on Sensilet wallet while unauthenticated. Please call authenticate() first.`);
        }
    }
    extensionGuard(method) {
        if (!this.sensilet) {
            const provider = window.sensilet;
            if (typeof provider !== 'undefined') {
                this.sensilet = provider;
            }
            else {
                window.open('https://sensilet.com/', '_blank');
                throw new core_1.AuthenticationError(`Attempted to call ${method} on Sensilet wallet while extension is not installed. Please install Sensilet Wallet Extension first.`);
            }
        }
    }
}
exports.SensiletWallet = SensiletWallet;
